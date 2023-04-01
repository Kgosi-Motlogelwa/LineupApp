import { useState, useEffect } from "react";
import "./App.css"
import { storage, db } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, addDoc, collection, getDocs } from "firebase/firestore"; 

function App() {
    // State to store uploaded file
    const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer | string>("");
    const [name, setName] = useState<string>("")
    // progress
    const [percent, setPercent] = useState(0);
    const [filesDisplays, setFilesDisplays] = useState<any[]>([])

    useEffect(()=>{
       
        getFiles()
    },[filesDisplays])

    // Get files from firestore
    const getFiles = async () => {
        const querySnapshot = await getDocs(collection(db, "file"));
        let arr : any[] = []
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        arr.push(doc.data())
        // console.log(doc.id, " => ", doc.data());
        });
        setFilesDisplays(arr)
    }

    // Handle file upload event and update state
    function handleChange(event: any) {
    setFile(event.target.files[0]);
    }

    const handleUpload = () => {
    if (!file) {
        alert("Please upload an image first!");
    }
    // @ts-ignore
    const storageRef = ref(storage, `/files/${file?.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    // @ts-ignore
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
    "state_changed",
    (snapshot) => {
    const percent = Math.round(
    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );

    // update progress
    setPercent(percent);
    },
    (err) => console.log(err),
    () => {
    // download url
    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
    console.log(url);

    await addDoc(collection(db, "file"), {
        // @ts-ignore
        filename: file?.name,
        link: url,
        name: name
      });
      console.log("I ran")
    });
    }
    );
    };

    const handleChangeName = (e: any) => {
        setName(e.target.value)
    }
    return (
    <div className="App">
        <div className="App"> <input placeholder="Uploaded By" onChange={handleChangeName}/>
        <input type="file" onChange={handleChange} accept="/image/*" />
        <button onClick={handleUpload}>Upload</button>
        <br></br>
        <span> {percent} %</span></div>
        {filesDisplays.length > 0 && 
        <div className="App">
           { filesDisplays.map(file=>{
                return <>
                <p className="files" onClick={()=> {window.open(file.link)}}>Uploaded By: {file.name} File: {file.filename}</p>
                </>
            })}
        </div>}
    
    </div>
    );
}

export default App;