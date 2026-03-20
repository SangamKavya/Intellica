import Header from "../../components/Header";
import collegeLogo from "../../assets/logo-mic.png";

function HodHeader({ user }) {
  const name = user?.name || "";
  const department = user?.department || "";
  const title = `Welcome${name ? `, ${name}` : ""}`;
  const subtitle = `Head of the Department • ${department}`;

  return <Header title={title} subtitle={subtitle} logo={collegeLogo} />;
}

export default HodHeader;