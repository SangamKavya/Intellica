import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function NPTEL({ onBack, facultyId, mode = "upload" }) {

  const UploadComponent = (props) => (
    <UploadActivity
      category="NPTEL"
      facultyId={facultyId}
      {...props}
    />
  );

  return (
    <ProfessionalModule
      title="NPTEL Certifications"
      category="NPTEL"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={UploadComponent}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default NPTEL;