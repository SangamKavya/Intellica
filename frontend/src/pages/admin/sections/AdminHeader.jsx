import Header from "../../../components/Header";
import collegeLogo from "../../../assets/logo-mic.png";

function AdminHeader() {
  return (
    <Header title={"MIC College of Technology"} subtitle={"Welcome Admin"} logo={collegeLogo} />
  );
}

export default AdminHeader;