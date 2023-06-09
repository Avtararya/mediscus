import express from "express";
import axios from "axios";
import request from "request";

const router = express.Router();

const clientId = "SBX_002395";
const clientSecret = "f71714da-bfb6-4744-bc25-c839df86a29d";
// const searchQuery = "John Doe";

const getAccessToken = async (clientId, clientSecret) => {
  const response = await axios.post(
    "https://dev.abdm.gov.in/gateway/v0.5/sessions",
    {
      clientId: clientId,
      clientSecret: clientSecret,
    }
  );
  return response.data.accessToken;
};

const accessToken = await getAccessToken(clientId, clientSecret);

console.log(accessToken);

const BaseURI = "https://healthidsbx.abdm.gov.in";
const BasePath = "api";

// Generate Mobile OTP to start registration

router.post("/generateOtp", async (req, res) => {
  try {
    const { mobile } = req.body;
    const options = {
      url: `${BaseURI}/${BasePath}/v1/registration/mobile/generateOtp`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: { mobile },
    };
    request.post(options, (error, response, body) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
      } else {
        res.json(body);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.post("/resendOtp", async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const response = await axios.post(
      `${BaseURI}/${BasePath}/api/v1/registration/mobile/resendOtp`,
      {
        mobileNumber,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// // Verify Mobile OTP sent as part of registration transaction
router.post("/verifyOtp", async (req, res) => {
  try {
    const { txnId, otp } = req.body;

    const response = await axios.post(
      `${BaseURI}/${BasePath}/v1/registration/mobile/verifyOtp`,
      {
        otp,
        txnId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// // Verify Aadhaar OTP Only
// router.post("/aadhaar/verifyOTP", async (req, res) => {
//   try {
//     const { aadhaarNumber, otp } = req.body;

//     const response = await axios.post(
//       `${ BaseURI }/${ BasePath }/v1/registration/mobile/verifyOtp`,
//       {
//         aadhaarNumber,
//         otp,
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong." });
//   }
// });

// // Create Health ID with verified mobile token
router.post("/createHealthId", async (req, res) => {
  try {
    const { mobileNumber, token } = req.body;

    const response = await axios.post(`${BaseURI}/createHealthId`, {
      mobileNumber,
      token,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

export default router;
