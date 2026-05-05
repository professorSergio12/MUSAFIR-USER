export function welcomeEmailHtml(name) {
  return `
  <!-- Main Container -->
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f8f9fa;">
   
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to Musafir Tour & Travel! 🌍</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your journey of a thousand miles begins with a single step</p>
    </div>
     <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://res.cloudinary.com/dpu6rveug/image/upload/v1759556628/Screenshot_2025-10-04_110008_k8xzcm.png"
           alt="Travel Destination"
           style="width: 100%; max-width: 600px; height: 350px; object-fit: cover; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
    </div>
    <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #333; margin-bottom: 20px; text-align: center;">
        Hello <strong>${name}</strong>! 👋
      </p>
      <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin: 20px 0;">
        <p style="font-size: 16px; color: #555; margin: 0; line-height: 1.6;">
          <strong>🌟 Adventure Awaits!</strong><br>
          Thank you for joining Musafir Tour & Travel! We're thrilled to have you as part of our travel family.
          Get ready to explore breathtaking destinations, create unforgettable memories, and discover the world's hidden gems with us.
        </p>
      </div>
      <div style="text-align: center; margin: 25px 0;">
        <a href="professorsergio12.github.io/MUSAFIR/"
           style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          Start Your Journey 🚀
        </a>
      </div>
      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 25px;">
        Ready to make your travel dreams come true? Let's explore the world together! 🌍✈️
      </p>
    </div>
  </div>`;
}
