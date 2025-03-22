// TaskPopup.tsx
import React, { useState,DragEvent } from "react";
import { db } from "./firebase-config"; // Import your Firebase configuration
import { collection, addDoc } from "firebase/firestore";
import "./TaskPopup.css"; // Import your CSS for styling
import closeicon from "/Close Icon.svg"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
interface TaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: any) => void;
}
const TaskPopup: React.FC<TaskPopupProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    status: "",
    file: null as File | null,
  });
const storage = getStorage();
const uploadFile = async (file: File) => {
  const storageRef = ref(storage, `files/${file.name}`);
  await uploadBytes(storageRef, file);
  const fileURL = await getDownloadURL(storageRef);
  return fileURL; // Return the file URL for Firestore
};
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);
    const [status, setStatus] = useState("");

  // Drag and Drop Handlers
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setTask({ ...task, file: files[0] });
    }
  };
const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
setStatus(e.target.value);

  const { name, value } = e.target;
  setTask((prevTask) => ({
    ...prevTask,
    [name]: value,
  }));

  // Special case for status dropdown
  if (name === "status") {
    setStatus(value);
  }
};
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTask({ ...task, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let fileURL = null;
      if (task.file) {
        fileURL = await uploadFile(task.file); // Upload file if it exists
      }
      const docRef = await addDoc(collection(db, "tasks"), {
        ...task,
        file: fileURL, // Store the file URL instead of the File object
      });
      alert("Task added successfully!");
      onAddTask({ ...task, id: docRef.id, file: fileURL }); // Call the onAddTask function with the new task
      setTask({
        title: "",
        description: "",
        category: "Work",
        dueDate: "",
        status: "TO-DO", // Reset to default status
        file: null,
      });
      onClose(); // Close the popup after submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State to hold the selected status

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value); // Update the selected status
  };
  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Create Task</h2>
            <img src={closeicon} className="listicon1" onClick={onClose} />
          </div>
          <div className="line1"></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                required
                placeholder="Task title"
              />
            </div>

            <div className="form-group">
              <textarea
                name="description"
                value={task.description}
                onChange={handleChange}
                required
                placeholder={`Character Count: ${task.description.length} / 300`}
                maxLength={300} // Limit the number of characters
              />
            </div>
            <div className="contentsshow">
              <div className="form-group1">
                <label>Task Category*</label>
                <br />
                <div className="sep">
                  <button
                    type="button"
                    onClick={() => setTask({ ...task, category: "Personal" })}
                  >
                    Personal
                  </button>

                  <button
                    type="button"
                    onClick={() => setTask({ ...task, category: "Work" })}
                  >
                    Work
                  </button>
                </div>
              </div>

              <div className="form-group2">
                <label>Due on:</label>
                <br />
                <input
                  style={{ color: "black" }}
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  placeholder="DD/MM/YYYY"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group3">
                <label htmlFor="status-select">Status:</label>
                <br />
                <select
                  id="status-select"
                  name="status"
                  onChange={handleStatusChange}
                  value={task.status}
                  onChange={handleChange}
                >
                  <option value="">Choose</option> {/* Default option */}
                  <option value="TO-DO">To-Do</option>
                  <option value="IN-PROGRESS">In-Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div
              className="form-group4"
            >
              <label className="Attachment">Attachment</label>
              <div className="boxinside">
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  style={{ color: "black", cursor: "pointer" }}
                >
                  Drop your files here or <span>Update</span>
                </label>
              </div>
            </div>
            <div className="endbuttons">
              <button className="cancelbutton1" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="createbutton1" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default TaskPopup;
