import { useState } from "react";
import { useDropzone } from "react-dropzone";

const ULD = () => {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [ULDPriorities, setULDPriorities] = useState([]);
  const [text, setText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
      setIsDraggingFile(false);
    },
    onDragOver: () => setIsDraggingFile(true),
    onDragLeave: () => setIsDraggingFile(false),
  });

  const handleConvertClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (uploadedFiles.length > 0) {
      formData.append("file", uploadedFiles[0]);
    }

    if (ULDPriorities.length > 0) {
      formData.append("priorities", JSON.stringify(ULDPriorities));
    }

    try {
      const response = await fetch("https://cargo-manifest-api-e9624b976b19.herokuapp.com/generate-crossdocking-priorities", {
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


  const handlePaste = (e) => {
    e.preventDefault();

    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
    const parser = new DOMParser();
    const doc = parser.parseFromString(pastedData, 'text/html');
    const table = doc.querySelector("table");

    if (table) {
      const newULDPriorities = [];
      const extractedText = Array.from(table.querySelectorAll("tr"))
        .map(row => {
          const cells = Array.from(row.querySelectorAll("td")).map(cell => {
            return cell.textContent.toUpperCase()
              .replace(/\b(ROMPER|FONDO|PUERTA)\b/g, '')
              .replace(/\s+/g, '')
              .trim();
          });

          if (cells.some(cell => cell === "ULD" || cell === "PRIO")) {
            return null;
          }

          if (cells.length === 2) {
            newULDPriorities.push({
              ULD: cells[0],
              priority: parseInt(cells[1], 10)
            });
          }

          return cells.join(" ");
        })
        .join("\n");

      setULDPriorities(newULDPriorities);
      setText(extractedText);
    } else {
      const sanitizedText = pastedData
        .replace(/\b(ROMPER|FONDO|PUERTA)\b/g, '')
        .replace(/\s+/g, '')
        .trim();

      setText(sanitizedText);
    }
  };

  return (
    <main className="crossdocking-page">
      <form className="crossdocking-area">
        <p className="title">Upload Cargo Manifest by ULD</p>
        <div className={`crossdocking-upload-area ${isDraggingFile ? "crossdocking-upload-area-active" : ""}`}
          {...getRootProps()}
        >
          <p>Drag and drop your file here or</p>
          <input type='file' name="importSheet" id="importSheet" hidden {...getInputProps()} />
          <button className="upload-button" onClick={(e) => e.preventDefault()}>Browse File</button>
          <p>{uploadedFiles[0]?.path}</p>
        </div>
        <div className="priorities-area">
          <div className="priorities-textarea">
            <textarea className="textarea"
              value={text}
              onPaste={handlePaste}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste here the priorities table..."
              rows="10"
              cols="50"
            />
          </div>
        </div>
        <input type="submit" value="Generate CrossDocking" className="crossdocking-button" onClick={handleConvertClick} disabled={!(ULDPriorities.length && uploadedFiles.length)} />
      </form>
    </main>
  );
};

export default ULD;
