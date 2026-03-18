import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function Webinars({ onBack, facultyId, mode = "upload" }) {

  return (
    <ProfessionalModule
      title="Webinars"
      category="Webinar"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={(props) => (
        <UploadActivity
          category="Webinar"
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

export default Webinars;