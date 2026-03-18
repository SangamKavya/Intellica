import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function Incubation({ onBack, facultyId, mode = "upload" }) {

  return (
    <ProfessionalModule
      title="Startups / Incubation"
      category="Incubation"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={(props) => (
        <UploadActivity
          category="Incubation"
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

export default Incubation;