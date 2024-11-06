import { useState } from "react";
import { useDropzone } from "react-dropzone";
// import './index.css';


const airlines = [
  { id: "1", text: "choose an option" },
  { id: "2", text: "QR - Qatar", extensions: "PDF" },
  { id: "3", text: "5Y - Atlas", extensions: "PDF" },
]


const AWB = () => {

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [choosenAirline, setChoosenAirline] = useState(airlines[0]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles)
      setIsDraggingFile(false)
    },
    onDragOver: () => setIsDraggingFile(true),
    onDragLeave: () => setIsDraggingFile(false),
  });

  const isReadyToSubmit = () => !!uploadedFiles.length && choosenAirline.id !== '1'

  const isCorrectExtension = () => {
    const uploadedFile = uploadedFiles[0];
    if (!uploadedFile || !choosenAirline.extensions) return false;

    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
    const requiredExtension = choosenAirline.extensions.toLowerCase();
    return fileExtension === requiredExtension;
  };


  const handleConvertClick = async (e) => {
    e.preventDefault()

    if (uploadedFiles.length === 0 || choosenAirline.id === "1") return;

    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);

    try {
      const response = await fetch("https://cargo-manifest-api-e9624b976b19.herokuapp.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "manifest.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        window.alert("Erro na conversão do manifesto");
      }
    } catch (error) {
      window.alert("Erro ao enviar o arquivo:", error);
    }
  };

  return (
    <main className="main">
      <form className="form-area">
        <p className="title">Upload Cargo Manifest by AWB</p>
        <div className={`upload-area ${isDraggingFile ? "upload-area-active" : ""}`}
          {...getRootProps()}
        >
          <p>Drag and drop your file here or</p>
          <input type='file' name="importSheet" id="importSheet" hidden {...getInputProps()} />
          <button className="upload-button" onClick={(e) => e.preventDefault()}>Browse File</button>
          <p>{uploadedFiles[0]?.path}</p>
        </div>
        <div className="airline-area">
          <p>Select Airline:</p>
          <select
            className="airline-select"
            id="mySelect"
            value={choosenAirline.id}
            onChange={e => setChoosenAirline(airlines.find(({ id }) => e.target.value === id))}
          >
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.id}>
                {airline.text}
              </option>
            ))}
          </select>
          {isReadyToSubmit() && !isCorrectExtension()
            ? <div className="invalid-extension-error-message">
              <p className="error-message">Invalid file type. Please upload a <b>{choosenAirline.extensions}</b> file.</p>
            </div>
            : ''
          }
        </div>
        <input type="submit" value="Convert" className="convert-button" disabled={!isReadyToSubmit() || !isCorrectExtension()} onClick={handleConvertClick} />
      </form>
    </main>
  );
}

export default AWB;
