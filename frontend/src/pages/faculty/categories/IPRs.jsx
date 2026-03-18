import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function IPR({ onBack, facultyId, mode = "upload" }) {

  return (
    <ProfessionalModule
      title="IPR (Patents / Copyright / Trademark)"
      category="IPR"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={(props) => (
        <UploadActivity
          category="IPR"
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

export default IPR;