import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function Workshops({ onBack, facultyId, mode = "upload" }) {

  return (
    <ProfessionalModule
      title="Workshops"
      category="workshop"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={(props) => (
        <UploadActivity
          category="workshop"
          facultyId={facultyId}
          {...props}
        />
      )}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default Workshops;