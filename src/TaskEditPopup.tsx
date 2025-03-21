// TaskEditPopup.tsx
import React, { useState } from "react";
import closeicon from "/Close Icon.svg";
import "./TaskEditPopup.css";
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  file: File | null;
}

interface TaskEditPopupProps {
  isOpen: boolean;
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskEditPopup: React.FC<TaskEditPopupProps> = ({
  isOpen,
  task,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Task>(task);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement |HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData); // Update the task
    onClose(); // Close the popup
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Edit Task</h2>

            <img src={closeicon} className="listicon1" onClick={onClose} />
          </div>
          <div className="line1"></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contentsshow">
              <div className="form-group1">
                <label>Task Category*</label>
                <br />
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
              <div className="form-group2">
                <label>Due on:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group3">
                <label htmlFor="status-select">Status:</label>
                <br />
                <select
                  name="status"
                  id="status-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="TO-DO">TO-DO</option>
                  <option value="IN-PROGRESS">IN-PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>
            <div className="form-group4">
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
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default TaskEditPopup;
