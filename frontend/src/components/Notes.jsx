import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../AppTemp";
import "../App.css";

const Notes = () => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  // Estado para armazenar as notas
  const [notes, setNotes] = useState([]);
  // Estado para armazenar o valor da nova nota
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
      setIsDarkMode(localStorage.getItem("theme") === "dark");
    }, [setIsDarkMode]);

  // Função para adicionar uma nova nota à lista de notas
  const handleAddNote = () => {
    // Verifica se a nova nota não está vazia ou apenas com espaços em branco
    if (newNote.trim()) {
      // Adiciona a nova nota à lista de notas e limpa o campo de entrada
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  return (
    <div className={`notes ${isDarkMode ? "dark-mode" : ""}`}>
      <h1 className={isDarkMode ? "dark-mode" : ""}>Notas</h1>

      {/* Área de texto para digitar a nova nota */}
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Adicione uma nova nota..."
        className={isDarkMode ? "dark-mode" : ""}
      />

      {/* Botão para adicionar a nota */}
      <button onClick={handleAddNote} className={isDarkMode ? "dark-mode" : ""}>
        Adicionar Nota
      </button>

      {/* Lista de notas */}
      <ul className={isDarkMode ? "dark-mode" : ""}>
        {notes.map((note, index) => (
          <li key={index} className={isDarkMode ? "dark-mode" : ""}>
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
