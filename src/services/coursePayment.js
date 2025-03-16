import { toast } from "react-hot-toast";
import axios from "axios";

// Function to dynamically load a script
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.body.appendChild(script);
  });
}

// Function to handle the course purchase process
export async function buyCourse(courseId, user, navigate, dispatch) {
  const toastId = toast.loading("Processing payment...");

  try {
    // 1. Load the Razorpay script
    const scriptLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!scriptLoaded) {
      toast.error("Payment gateway failed to load. Please try again.");
      return;
    }

    // 2. Create an order with the backend
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/payment/capturePayment`,
      { courseId },
      {
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      console.log("Buy Course Error:", response.data.message);
      toast.error("Could not initiate payment");
      return;
    }

    const orderData = response.data.data;

    // 3. Configure Razorpay payment options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderData.currency,
      amount: orderData.amount,
      order_id: orderData.id,
      name: "StudyNotion",
      description: "Course Purchase",
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      handler: function (response) {
        // 4. Verify payment after successful completion
        verifyPayment(
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courseId: courseId,
          },
          navigate,
          dispatch
        );
      },
      theme: {
        color: "#F7F7F7",
      }
    };

    // 5. Open Razorpay payment dialog
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    // 6. Handle payment failure
    paymentObject.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again.");
      console.log("Payment Failed Response:", response.error);
    });
  } catch (error) {
    console.log("Buy Course Error:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    toast.dismiss(toastId);
  }
}

// Function to verify the payment
async function verifyPayment(paymentData, navigate, dispatch) {
  const toastId = toast.loading("Verifying payment...");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/payment/verifyPayment`,
      paymentData,
      {
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      console.log("Verify Payment Error:", response.data.message);
      toast.error("Payment verification failed");
      return;
    }

    toast.success("Course purchased successfully!");
    navigate("/dashboard/enrolled-courses");
  } catch (error) {
    console.log("Payment Verification Error:", error);
    toast.error("Payment verification failed. Please contact support.");
  } finally {
    toast.dismiss(toastId);
  }
}
