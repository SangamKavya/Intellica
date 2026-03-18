import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function MOUs({ onBack, facultyId, mode = "upload" }) {

  const UploadComponent = (props) => (
    <UploadActivity
      category="mou"
      facultyId={facultyId}
      {...props}
    />
  );

  return (
    <ProfessionalModule
      title="MOUs (Memorandum of Understanding)"
      category="mou"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={UploadComponent}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default MOUs;