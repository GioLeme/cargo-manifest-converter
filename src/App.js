import { useState } from "react";
import { useDropzone } from "react-dropzone";
import logo from "./assets/logo.png"


const airlines = [
  { id: "1", text: "choose an option" },
  { id: "2", text: "QR - Qatar" },
  { id: "3", text: "5Y - Atlas" },
]


function App() {

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

  const handleConvertClick = async (e) => {
    e.preventDefault()

    if (uploadedFiles.length === 0 || choosenAirline.id === "1") return;

    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);

    try {
      const response = await fetch("http://localhost:8000/upload", {
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
    <div className="App">
      <header className="header" >
        <div className="logo" >
          <img src={logo} alt="logo" className="logo-image" />
          <h1>Cargo Manifest Converter</h1>
        </div>
        <nav className="header__nav">
          <a href="#AWB" className="header__nav_AWB">Manifest by AWB</a>
          <a href="#ULD" className="header__nav_ULD">Manifest by ULD</a>
        </nav>
      </header>
      <main className="main">
        <form className="form-area">
          <p className="title">Upload Cargo Manifest by AWB</p>
          <div className={`upload-area ${isDraggingFile ? "upload-area-active" : ""}`}
            {...getRootProps()}
          >
            <p>Drag and drop your file here or</p>
            <input type='file' name="importSheet" id="importSheet" accept=".pdf" hidden {...getInputProps()} />
            <button className="upload-button">Browse File</button>
            <p>{uploadedFiles[0]?.path}</p>
          </div>
          <div className="airline-area">
            <p>Select airline:</p>
            <select className="airline-select" id="mySelect" value={choosenAirline.id} onChange={e => setChoosenAirline(e.target.value)}>
              {airlines.map((airlines) => (
                <option key={airlines.value} value={airlines.value}>
                  {airlines.text}
                </option>
              ))}
            </select>
          </div>
          <input type="submit" value="Convert" className="convert-button" disabled={!uploadedFiles.length || choosenAirline.id === "1"} onClick={handleConvertClick}/>
        </form>
      </main>
    </div>
  );
}

export default App;
