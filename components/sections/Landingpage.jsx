import Squares from "../Squares";
import FeatureCards from "../FeatureCards";
import Link from "next/link";

// In Next.js, anything in /public is available directly via /assets/...
// No need to import them.
const icons = [
  // Left
  { src: "/assets/icons/react.png", style: { top: "15%", left: "3%", transform: "rotate(-15deg)" } },
  { src: "/assets/icons/js.png", style: { top: "40%", left: "15%", transform: "rotate(10deg)" } },
  { src: "/assets/icons/code.webp", style: { top: "70%", left: "5%", transform: "rotate(-5deg)" } },
  // Center
  { src: "/assets/icons/docker.png", style: { top: "8%", left: "30%", transform: "rotate(20deg)" } },
  { src: "/assets/icons/node.png", style: { top: "60%", left: "70%", transform: "rotate(-20deg)" } },
  { src: "/assets/icons/java.png", style: { top: "8%", left: "65%", transform: "rotate(15deg)" } },
  { src: "/assets/icons/cpp.png", style: { top: "62%", left: "30%", transform: "rotate(5deg)" } },
  // Right
  { src: "/assets/icons/rust.png", style: { top: "18%", left: "90%", transform: "rotate(15deg)" } },
  { src: "/assets/icons/go.png", style: { top: "45%", left: "80%", transform: "rotate(-10deg)" } },
  { src: "/assets/icons/github.png", style: { top: "75%", left: "90%", transform: "rotate(25deg)" } },
];

function Landingpage() {
  const size = 60;

  return (
    <>
      {/* Background Squares */}
      <div className="squarediv" style={{ "--square-size": `${size}px` }}>
        <Squares
          speed={0.5}
          squareSize={size}
          direction="up"
          borderColor="#dbdbdbda"
          hoverFillColor="#e1e1e1c9"
        />
      </div>

      {/* Floating Icons */}
      <div className="icons-background">
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon.src}
            alt=""
            className="floating-icon"
            style={icon.style}
          />
        ))}
      </div>

      {/* Main Title Section */}
      <div className="title-container">
        <img src="/assets/foliofusionLogo.png" alt="FolioFusion Logo" className="logo-image" />
        <h1 className="title">
          Build Your Developer <br /> Portfolio in{" "}
          <span className="gradient-text">Minutes</span>
        </h1>
        <p className="description">
          FolioFusion helps developers showcase their work with beautiful,
          <br />
          customizable portfolios. No coding required—just fill in your details
          and
          <br />
          share your unique link.
        </p>
        <div className="button-container">
         <Link href="/generate"><button className="btn btn-primary">Create Your Portfolio</button></Link> 
          <button className="btn btn-secondary">View Demo</button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="featurecards">
        <h1>Everything You Need to Stand Out</h1>
        <p>
          Professional portfolio features that showcase your skills and
          experience
        </p>
        <FeatureCards />
      </div>

      {/* Call To Action */}
      <section className="cta-section">
        <h2>Ready to Build Your Portfolio?</h2>
        <p>Join developers worldwide who trust FolioFusion to showcase their work.</p>
        <button className="btn btn-secondary">Get Started for Free</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <img src="/assets/foliofusionLogo.png" alt="FolioFusion Logo" className="footer-logo" />
          <p className="footer-text">© 2025 FolioFusion. Build beautiful portfolios.</p>
        </div>
      </footer>
    </>
  );
}

export default Landingpage;
