import React, { useState, useEffect } from "react";
import "./first.css";
import { db, auth } from "./firebase-config";
import logout from "/logout_icon.svg";
import boardicon from "/Group 1171276211.svg";
import listicon from "/list_icon.svg";
import entericon from "/Union.svg";
import editicon from "/more_icon.svg";
import editsymbol from "/edit_icon.svg";
import deletesymbol from "/delete_icon.svg";
import checkmark from "/checkmark.png";
import checkmarkgreen from "/checkmarkgreen.png";
import dragicon from "/drag_icon.png";
import TaskEditPopup from "./TaskEditPopup";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import taskicon from "/task_icon.png";
import TaskPopup, { TaskType } from "./TaskPopup";
interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  category: string;
  description: string;
  file: File | null;
}
interface Activity {
  timestamp: string;
  action: string;
}
const First: React.FC = () => {
  const exampleTasks: Task[] = [];
  const exampleTasks2: Task[] = [];
  const exampleTasks3: Task[] = [];
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  const [tasks2, setTasks2] = useState<Task[]>(exampleTasks2);
  const [tasks3, setTasks3] = useState<Task[]>(exampleTasks3);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showOptions1, setShowOptions1] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("+");
  const [taskInput, setTaskInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activityLog, setActivityLog] = useState<Activity[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [Visible, sVisible] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [isMoved1, setIsMoved1] = useState(false);
  const [isMoved2, setIsMoved2] = useState(false);
  const [activeSection, setActiveSection] = useState("list");
  const [show, setShow] = useState(false);
  const [selStatus, setSelStatus] = useState("+");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskId1, setSelectedTaskId1] = useState<String | null>(null);
  const [isTodoVisible, setIsTodoVisible] = useState<boolean>(true);
  const [isInProgressVisible, setIsInProgressVisible] = useState<boolean>(true);
  const [isCompletedVisible, setIsCompletedVisible] = useState<boolean>(true);
  const [tasks4, setTasks4] = useState<Task[]>([]);

  const handleAddTask = (task: Task) => {
    setTasks4((prevTasks) => [...prevTasks, task]);
  };

  const categorizedTasks = {
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    COMPLETED: tasks.filter((task) => task.status === "COMPLETED"),
  };

  const toggleTodoVisibility = () => {
    setIsTodoVisible(!isTodoVisible);

    setIsMoved(!isMoved);
  };

  const toggleInProgressVisibility = () => {
    setIsInProgressVisible(!isInProgressVisible);

    setIsMoved1(!isMoved1);
  };

  const toggleCompletedVisibility = () => {
    setIsCompletedVisible(!isCompletedVisible);

    setIsMoved2(!isMoved2);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const taskCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(taskCollection);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks3(taskList);
    };
    fetchTasks();
  }, []);

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setEditPopupOpen(true);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User  logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const handleUpdateTask = async (updatedTask: Task) => {
    if (selectedTask) {
      const taskRef = doc(db, "tasks", selectedTask.id);
      await updateDoc(taskRef, updatedTask);
      setTasks3(
        tasks3.map((task) => (task.id === selectedTask.id ? updatedTask : task))
      );
      logActivity(`Task "${updatedTask.title}" was edited.`);
    }
  };

  const logActivity = (action: string) => {
    const timestamp = new Date().toLocaleString();
    setActivityLog([...activityLog, { timestamp, action }]);
  };
  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    logActivity(`Task with ID "${id}" was deleted.`);
  };

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: taskInput,
      dueDate: dueDate,
      status: selectedStatus,
      category: selStatus,
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setDueDate("");
    setShowOptions(false);
    setSelectedStatus("+");
    setSelStatus("+");
  };

  const handleCancel = () => {
    setTaskInput("");
    setDueDate("");
    setShowOptions(false);
    setSelectedStatus("+");
    setSelStatus("+");
  };
  useEffect(() => {
    const fetchTasks = async () => {
      const taskCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(taskCollection);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks3(taskList);
    };
    fetchTasks();
  }, []);
  const toggleOptions = (taskId: string) => {
    setSelectedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };
  const changeTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    setShowOptions1(null);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks2);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };
  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory)
    : tasks;
  return (
    <div className="task-buddy">
      <div className="head">
        <div className="tasklogo">
          <img src={taskicon} className="logo" />
          <span>TaskBuddy</span>
        </div>
        <div className="profile">
          <img src={user?.photoURL} className="profilepic" />
          <span>{user ? user.displayName : "User"}</span>
        </div>
      </div>
      <header>
        <div className="left">
          <div
            id="list"
            onClick={() => handleSectionChange("list")}
            className={activeSection === "list" ? "active-link" : ""}
          >
            <img src={listicon} className="listicon1" />
            <h5>List</h5>
          </div>
          <div
            id="board"
            onClick={() => handleSectionChange("board")}
            className={activeSection === "board" ? "active-link" : ""}
          >
            <img src={boardicon} className="boardicon" />
            <h5>Board</h5>
          </div>
        </div>
        <button className="logoutbutton" onClick={handleLogout}>
          <img src={logout} className="logouticon" />
          <h5>Logout</h5>
        </button>
      </header>

      <div className="filters">
        <div className="leftfilter">
          <h5>Filter by:</h5>
          <div className="twobars">
            <div className="categorybar">
              <select
                id="category-select"
                defaultValue={"Category"}
                onChange={handleCategoryChange}
              >
                <option value="">All</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div className="duedatebar">
              <select>
                <option>Due Date</option>
                {/* Add date options here */}
              </select>
            </div>
          </div>
        </div>

        <div className="rightside">
          <div className="searchbox">
            <input className="boxx" type="search" placeholder="Search" />
          </div>
          <div className="addbutton1">
            <button onClick={() => setPopupOpen(true)}>Add Task</button>
            <TaskPopup
              isOpen={isPopupOpen}
              onClose={() => setPopupOpen(false)}
            />
          </div>
        </div>
      </div>
      <div className="line"></div>
      {activeSection === "list" && (
        <div className="task-section">
          <div className="tophead">
            <div className="no1">Task Name</div>
            <div className="no2">Due on</div>
            <div className="no3">Task Status</div>
            <div className="no4">Task category</div>
          </div>

          <div className="separate">
            <div className="tasklist">
              <h4>
                Todo ({tasks.filter((task) => task.status === "TO-DO").length})
              </h4>
              <h3>
                <i
                  onClick={toggleTodoVisibility}
                  className={`arrow ${isMoved ? "moved" : ""}`}
                  id="arow"
                ></i>
              </h3>
            </div>
          </div>
          <div className="add-task">
            <button onClick={() => setIsVisible(!isVisible)}>+ ADD TASK</button>
          </div>

          <div className="holder">
            <div className="section2">
              <div
                id="addtitle"
                className={`content ${
                  isVisible ? "addtitletrue enter" : "addtitlefalse enter"
                }`}
              >
                <div className="enter">
                  <div className="tophead1">
                    <div className="n1">
                      <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder=" Task Title"
                        required
                      />
                    </div>
                    <div className="n2">
                      <input
                        type="date"
                        placeholder="add"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="n3">
                      <div
                        className="plus"
                        onClick={() => setShowOptions(!showOptions)}
                      >
                        {`${selectedStatus}`}
                      </div>
                      {showOptions && (
                        <div className="status-options">
                          <option
                            onClick={() => {
                              setSelectedStatus("TO-DO");
                              setShowOptions(false);
                            }}
                          >
                            TO-DO
                          </option>
                          <option
                            onClick={() => {
                              setSelectedStatus("IN-PROGRESS");
                              setShowOptions(false);
                            }}
                          >
                            IN-PROGRESS
                          </option>
                          <option
                            onClick={() => {
                              setSelectedStatus("COMPLETED");
                              setShowOptions(false);
                            }}
                          >
                            COMPLETED
                          </option>
                        </div>
                      )}
                    </div>
                    <div className="n4">
                      <div className="plus" onClick={() => setShow(!show)}>
                        {`${selStatus}`}
                      </div>
                      {show && (
                        <div className="status-options">
                          <option
                            onClick={() => {
                              setSelStatus("WORK");
                              setShow(false);
                            }}
                          >
                            WORK
                          </option>
                          <option
                            onClick={() => {
                              setSelStatus("PERSONAL");
                              setShow(false);
                            }}
                          >
                            PERSONAL
                          </option>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="addbutton">
                    <button className="add" onClick={addTask}>
                      ADD
                      <img src={entericon} className="char" />
                    </button>
                    <button className="cancelbutton" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="task-list"
              className={`content ${
                isTodoVisible ? "task-listopen " : "task-listclose"
              }`}
            >
              {tasks
                .filter((task) => task.status === "TO-DO")
                .map((task) => (
                  <div key={task.id} className="checkboxcheck">
                    <input className="checkboxsize" type="checkbox" />
                    <img src={dragicon} className="dragicon" />
                    <img src={checkmark} className="check" />
                    <div className="task-item">
                      <span className="titilename">{task.title}</span>
                      <span className="duedate">{task.dueDate}</span>
                      <div className="hi"> </div>
                      <span
                        className="bgbox"
                        onClick={() =>
                          setShowOptions1(
                            showOptions1 === task.id ? null : task.id
                          )
                        }
                      >
                        {task.status}
                      </span>
                      {showOptions1 === task.id && (
                        <div className="status-options1">
                          <div
                            onClick={() => changeTaskStatus(task.id, "TO-DO")}
                          >
                            TO-DO
                          </div>
                          <div
                            onClick={() =>
                              changeTaskStatus(task.id, "IN-PROGRESS")
                            }
                          >
                            IN-PROGRESS
                          </div>
                          <div
                            onClick={() =>
                              changeTaskStatus(task.id, "COMPLETED")
                            }
                          >
                            COMPLETED
                          </div>
                        </div>
                      )}
                      <span className="waste">{task.category}</span>

                      <div className="editdeletebutton">
                        <div
                          className="imageoption"
                          onClick={() => toggleOptions(task.id)}
                        >
                          <img src={editicon} className="listicon" />
                        </div>
                        {selectedTaskId === task.id && (
                          <div className="buttonseditdelete">
                            <h4
                              onClick={() => {
                                console.log("Edit task", task.id);
                                handleEditClick(task);
                              }}
                            >
                              <img src={editsymbol} className="editsymbol" />
                              Edit
                            </h4>
                            <h4 onClick={() => deleteTask(task.id)}>
                              {""}
                              <img src={deletesymbol} className="editsymbol" />
                              Delete
                            </h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {selectedTask && (
              <TaskEditPopup
                isOpen={isEditPopupOpen}
                task={selectedTask}
                onClose={() => setEditPopupOpen(false)}
                onUpdate={handleUpdateTask}
              />
            )}
            <div className="taslist2">
              <div className="tasklist2">
                <h4>
                  In-Progress (
                  {tasks.filter((task) => task.status === "IN-PROGRESS").length}
                  )
                </h4>
                <h3>
                  <i
                    onClick={toggleInProgressVisibility}
                    className={`arrow ${isMoved1 ? "moved" : ""}`}
                    id="arow"
                  ></i>
                </h3>
              </div>
              <div
                id="task-list"
                className={`content ${
                  isInProgressVisible ? "task-listopen " : "addtitlefalse input"
                }`}
              >
                {tasks
                  .filter((task) => task.status === "IN-PROGRESS")
                  .map((task) => (
                    <div key={task.id} className="checkboxcheck">
                      <input className="checkboxsize" type="checkbox" />
                      <img src={dragicon} className="dragicon" />
                      <img src={checkmark} className="check" />

                      <div className="task-item">
                        <span className="titilename">{task.title}</span>
                        <span>{task.dueDate}</span>
                        <div className="hi"> </div>
                        <span
                          className="bgbox"
                          onClick={() =>
                            setShowOptions1(
                              showOptions1 === task.id ? null : task.id
                            )
                          }
                        >
                          {task.status}
                        </span>
                        {showOptions1 === task.id && ( // Show options only for the selected task
                          <div className="status-options1">
                            <div
                              onClick={() => changeTaskStatus(task.id, "TO-DO")}
                            >
                              TO-DO
                            </div>
                            <div
                              onClick={() =>
                                changeTaskStatus(task.id, "IN-PROGRESS")
                              }
                            >
                              IN-PROGRESS
                            </div>
                            <div
                              onClick={() =>
                                changeTaskStatus(task.id, "COMPLETED")
                              }
                            >
                              COMPLETED
                            </div>
                          </div>
                        )}
                        <span>{task.category}</span>

                        <div className="editdeletebutton">
                          <div
                            className="imageoption"
                            onClick={() => toggleOptions(task.id)}
                          >
                            <img src={editicon} className="listicon" />
                          </div>
                          {selectedTaskId === task.id && (
                            <div className="buttonseditdelete">
                              <h4
                                onClick={() => {
                                  console.log("Edit task", task.id);
                                  handleEditClick(task);
                                }}
                              >
                                <img src={editsymbol} className="editsymbol" />
                                Edit
                              </h4>
                              <h4 onClick={() => deleteTask(task.id)}>
                                {""}
                                <img
                                  src={deletesymbol}
                                  className="editsymbol"
                                />
                                Delete
                              </h4>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="taslist3">
              <div className="tasklist3">
                <h4>
                  Completed (
                  {tasks.filter((task) => task.status === "COMPLETED").length})
                </h4>
                <h3>
                  <i
                    onClick={toggleCompletedVisibility}
                    className={`arrow ${isMoved2 ? "moved" : ""}`}
                    id="arow"
                  ></i>
                </h3>
              </div>
              <div
                id="task-list"
                className={`content ${
                  isCompletedVisible ? "task-listopen " : "addtitlefalse input"
                }`}
              >
                {tasks
                  .filter((task) => task.status === "COMPLETED")
                  .map((task) => (
                    <div key={task.id} className="checkboxcheck">
                      <input className="checkboxsize" type="checkbox" />
                      <img src={dragicon} className="dragicon" />
                      <img src={checkmarkgreen} className="check" />
                      <div className="task-item">
                        <span className="nameunderline titilename">
                          {task.title}
                        </span>
                        <span>{task.dueDate}</span>
                        <div className="hi"> </div>
                        <span
                          className="bgbox"
                          onClick={() =>
                            setShowOptions1(
                              showOptions1 === task.id ? null : task.id
                            )
                          }
                        >
                          {task.status}
                        </span>
                        {showOptions1 === task.id && ( // Show options only for the selected task
                          <div className="status-options1">
                            <div
                              onClick={() => changeTaskStatus(task.id, "TO-DO")}
                            >
                              TO-DO
                            </div>
                            <div
                              onClick={() =>
                                changeTaskStatus(task.id, "IN-PROGRESS")
                              }
                            >
                              IN-PROGRESS
                            </div>
                            <div
                              onClick={() =>
                                changeTaskStatus(task.id, "COMPLETED")
                              }
                            >
                              COMPLETED
                            </div>
                          </div>
                        )}
                        <span>{task.category}</span>
                        <div className="editdeletebutton">
                          <div
                            className="imageoption"
                            onClick={() => toggleOptions(task.id)}
                          >
                            <img src={editicon} className="listicon" />
                          </div>
                          {selectedTaskId === task.id && (
                            <div className="buttonseditdelete">
                              <h4
                                onClick={() => {
                                  console.log("Edit task", task.id);
                                  handleEditClick(task);
                                }}
                              >
                                <img src={editsymbol} className="editsymbol" />
                                Edit
                              </h4>
                              <h4 onClick={() => deleteTask(task.id)}>
                                {""}
                                <img
                                  src={deletesymbol}
                                  className="editsymbol"
                                />
                                Delete
                              </h4>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSection === "board" && (
        <div className="boardsection">
          <div className="fullcontent">
            <div className="box1">
              <h3>TO-DO</h3>

              <div
                id="t"
                className={`content ${
                  Visible ? "task-listopen line11" : "addtitlefalse input"
                }`}
              >
                {tasks
                  .filter((task) => task.status === "TO-DO")
                  .map((task) => (
                    <div key={task.id} className="individual">
                      <div className="boardtasktitle">
                        <span>{task.title}</span>
                        <div className="editdeletebutton">
                          <div
                            className="imageoption"
                            onClick={() => toggleOptions(task.id)}
                          >
                            <img src={editicon} className="listicon2" />
                          </div>
                          {selectedTaskId === task.id && (
                            <div className="buttonseditdelete1">
                              <h4
                                onClick={() => {
                                  console.log("Edit task", task.id);
                                  handleEditClick(task);
                                }}
                              >
                                <img src={editsymbol} className="editsymbol" />
                                Edit
                              </h4>
                              <h4 onClick={() => deleteTask(task.id)}>
                                {""}
                                <img
                                  src={deletesymbol}
                                  className="editsymbol"
                                />
                                Delete
                              </h4>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="categorydate">
                        <span>{task.category}</span>
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="box2">
              <h3>IN-PROGRESS</h3>
              <div
                id="t"
                className={`content ${
                  Visible ? "task-listopen line11" : "addtitlefalse input"
                }`}
              >
                {tasks
                  .filter((task) => task.status === "IN-PROGRESS")
                  .map((task) => (
                    <div key={task.id} className="individual">
                      <div className="boardtasktitle">
                        <span>{task.title}</span>
                        <div className="editdeletebutton">
                          <div
                            className="imageoption"
                            onClick={() => toggleOptions(task.id)}
                          >
                            <img src={editicon} className="listicon2" />
                          </div>
                          {selectedTaskId === task.id && (
                            <div className="buttonseditdelete1">
                              <h4
                                onClick={() => {
                                  console.log("Edit task", task.id);
                                  handleEditClick(task);
                                }}
                              >
                                <img src={editsymbol} className="editsymbol" />
                                Edit
                              </h4>
                              <h4 onClick={() => deleteTask(task.id)}>
                                {""}
                                <img
                                  src={deletesymbol}
                                  className="editsymbol"
                                />
                                Delete
                              </h4>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="categorydate">
                        <span>{task.category}</span>
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="box3">
              <h3>COMPLETED</h3>
              <div
                id="t"
                className={`content ${
                  Visible ? "task-listopen line11" : "addtitlefalse input"
                }`}
              >
                {tasks
                  .filter((task) => task.status === "COMPLETED")
                  .map((task) => (
                    <div key={task.id} className="individual">
                      <div className="boardtasktitle">
                        <span className="nameunderline">{task.title}</span>
                        <div className="editetebutton">
                          <img
                            src={editicon}
                            onClick={() => {
                              toggleOptions(task.id);
                              setShow1(!show1);
                            }}
                            className="licon"
                          />
                          {selectedTaskId === task.id && (
                            <div className="staons">
                              <option
                                onClick={() => {
                                  handleEditClick(task);
                                  setSelectedTaskId1(null);
                                  setShow1(false);
                                }}
                              >
                                <img src={editsymbol} className="lion" />
                                <span>Edit</span>
                              </option>
                              <option
                                onClick={() => {
                                  deleteTask(task.id);
                                  setSelectedTaskId1(null);
                                  setShow1(false);
                                }}
                              >
                                <img src={deletesymbol} className="licon" />
                                <span>Delete</span>
                              </option>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="categorydate">
                        <span>{task.category}</span>
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <ul>
            {activityLog.map((entry, index) => (
              <li key={index}>
                <strong>{entry.timestamp}</strong>: {entry.action}
              </li>
            ))}
          </ul>

          {selectedTask && (
            <TaskEditPopup
              isOpen={isEditPopupOpen}
              task={selectedTask}
              onClose={() => setEditPopupOpen(false)}
              onUpdate={handleUpdateTask}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default First;
