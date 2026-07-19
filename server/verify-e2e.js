const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Ensure fallback secret in case server env lacks it
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "super_secret_verification_key_123456";
}

const connectDB = require("./config/db");
const { registerUser, loginUser } = require("./controllers/authController");
const { generateAIContent, improvePrompt } = require("./controllers/promptController");
const User = require("./models/User");
const Prompt = require("./models/Prompt");
const Template = require("./models/Template");

const mockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.jsonData = data;
    return res;
  };
  return res;
};

async function runTests() {
  console.log("=== STARTING END-TO-END VERIFICATION ===");
  
  // 1. Database Connection
  await connectDB();
  
  // Clean up any old verification tests
  await User.deleteMany({ 
    email: { 
      $in: [
        "test-verify-e2e@promptcraft.ai", 
        "demo@promptcraft.ai"
      ] 
    } 
  });
  
  let testUserToken = "";
  let testUserId = "";

  // 2. Register User Test
  console.log("\n1. Testing User Registration...");
  const registerReq = {
    body: {
      name: "Test E2E User",
      email: "test-verify-e2e@promptcraft.ai",
      password: "password123"
    }
  };
  const registerRes = mockRes();
  await registerUser(registerReq, registerRes);
  
  console.log(`Status Code: ${registerRes.statusCode}`);
  console.log("Response:", registerRes.jsonData);
  if (registerRes.statusCode === 201 && registerRes.jsonData.success) {
    console.log("✔ User registration test PASSED!");
    testUserToken = registerRes.jsonData.data.token;
    testUserId = registerRes.jsonData.data._id;
  } else {
    console.error("✘ User registration test FAILED!");
    process.exit(1);
  }

  // 3. Login User Test (and subsequent login test to verify no double hashing)
  console.log("\n2. Testing User Login...");
  const loginReq = {
    body: {
      email: "test-verify-e2e@promptcraft.ai",
      password: "password123"
    }
  };
  const loginRes = mockRes();
  await loginUser(loginReq, loginRes);
  
  console.log(`Status Code: ${loginRes.statusCode}`);
  if (loginRes.statusCode === 200 && loginRes.jsonData.success) {
    console.log("✔ User login test PASSED!");
  } else {
    console.error("✘ User login test FAILED!");
    process.exit(1);
  }

  // 3b. Verify Subsequent Login after simulated logout (ensures no double-hashing occurred during profile save etc.)
  console.log("\n2b. Simulating User profile save and verify Login again...");
  const userObj = await User.findById(testUserId);
  userObj.name = "Test E2E User Updated";
  await userObj.save(); // This will trigger the pre-save hook where we fixed the double-hashing bug!
  
  const secondLoginRes = mockRes();
  await loginUser(loginReq, secondLoginRes);
  console.log(`Subsequent Login Status Code: ${secondLoginRes.statusCode}`);
  if (secondLoginRes.statusCode === 200 && secondLoginRes.jsonData.success) {
    console.log("✔ Login after logout and profile save PASSED (no double-hashing)!");
  } else {
    console.error("✘ Login after logout and profile save FAILED! Double hashing bug remains.");
    process.exit(1);
  }

  // 4. Demo Login test
  console.log("\n3. Testing Predefined Demo Login...");
  const demoReq = {
    body: {
      email: "demo@promptcraft.ai",
      password: "demopass123"
    }
  };
  const demoRes = mockRes();
  await loginUser(demoReq, demoRes);
  console.log(`Demo Login Status Code: ${demoRes.statusCode}`);
  if (demoRes.statusCode === 200 && demoRes.jsonData.success) {
    console.log("✔ Demo login auto-registration and credential verification PASSED!");
    
    // Verify 15 templates are created for the demo user
    const demoUser = await User.findOne({ email: "demo@promptcraft.ai" });
    const tplCount = await Template.countDocuments({ createdBy: demoUser._id });
    console.log(`Demo templates count: ${tplCount}`);
    if (tplCount === 15) {
      console.log("✔ Seeding exactly 15 templates for demo user PASSED!");
    } else {
      console.error(`✘ Seeding templates failed: expected 15, got ${tplCount}`);
      process.exit(1);
    }

    // Call demo login again to test duplicate check
    const demoRes2 = mockRes();
    await loginUser(demoReq, demoRes2);
    const tplCount2 = await Template.countDocuments({ createdBy: demoUser._id });
    console.log(`Demo templates count after subsequent login: ${tplCount2}`);
    if (tplCount2 === 15) {
      console.log("✔ Duplicate templates check PASSED!");
    } else {
      console.error(`✘ Duplicate templates check FAILED: expected 15, got ${tplCount2}`);
      process.exit(1);
    }
  } else {
    console.error("✘ Demo login FAILED!");
    process.exit(1);
  }

  // 5. AI Content Generator Test
  console.log("\n4. Testing Gemini AI Content Generator...");
  const contentReq = {
    user: { id: testUserId },
    body: {
      topic: "Benefits of Next.js 15 routing mechanisms",
      contentType: "Article",
      tone: "Professional",
      outputLength: "short"
    }
  };
  const contentRes = mockRes();
  await generateAIContent(contentReq, contentRes);
  
  console.log(`Status Code: ${contentRes.statusCode}`);
  if (contentRes.statusCode === 201 && contentRes.jsonData?.success) {
    console.log("✔ AI Content Generator test PASSED!");
  } else {
    console.error("✘ AI Content Generator test FAILED!");
    process.exit(1);
  }

  // 6. AI Prompt Improver Test
  console.log("\n5. Testing Gemini AI Prompt Improver (JSON Schema)...");
  const improverReq = {
    user: { id: testUserId },
    body: {
      prompt: "Write a node.js express database query code snippet"
    }
  };
  const improverRes = mockRes();
  await improvePrompt(improverReq, improverRes);
  
  console.log(`Status Code: ${improverRes.statusCode}`);
  if (improverRes.statusCode === 201 && improverRes.jsonData?.success) {
    console.log("✔ AI Prompt Improver test PASSED!");
  } else {
    console.error("✘ AI Prompt Improver test FAILED!");
    process.exit(1);
  }

  // Clean up verification data
  console.log("\nCleaning up verification records...");
  const finalDemoUser = await User.findOne({ email: "demo@promptcraft.ai" });
  if (finalDemoUser) {
    await Template.deleteMany({ createdBy: finalDemoUser._id });
  }
  await User.deleteMany({ 
    email: { 
      $in: [
        "test-verify-e2e@promptcraft.ai", 
        "demo@promptcraft.ai"
      ] 
    } 
  });
  await Prompt.deleteMany({ user: testUserId });
  
  console.log("\n=== ALL E2E VERIFICATIONS PASSED SUCCESSFULLY ===");
  mongoose.connection.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error("E2E Run Error:", err);
  process.exit(1);
});
