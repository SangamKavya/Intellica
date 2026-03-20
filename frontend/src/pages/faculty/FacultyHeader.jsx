import Header from "../../components/Header";
import collegeLogo from "../../assets/logo-mic.png";

function FacultyHeader({ user, readOnly }) {
  const name = user?.name || "";
  const department = user?.department || "";
  const title = readOnly ? `${name} Dashboard` : `Welcome${name ? `, ${name}` : ""}`;
  const subtitle = `Faculty • ${department}`;

  return <Header title={title} subtitle={subtitle} logo={collegeLogo} />;
}

export default FacultyHeader;