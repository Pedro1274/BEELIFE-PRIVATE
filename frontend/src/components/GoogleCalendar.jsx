import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import axios from "axios";
import "../App.css";

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);

  // 🔍 Busca eventos do backend
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://beelife-private.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedEvents = response.data.map((event) => ({
        id: event._id,
        title: event.title,
        start: event.due_date ? new Date(event.due_date) : new Date(),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 📌 Função para adicionar evento/tarefa ao clicar em um horário
  const handleDateClick = async (info) => {
    const title = prompt("Digite o nome do evento/tarefa:");
    if (!title) return;

    const newEvent = {
      title,
      due_date: info.dateStr,
      category: "evento",
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://beelife-private.onrender.com/api/tasks/", newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEvents(); // Atualiza os eventos após adicionar
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    }
  };

  // ✏️ Função para mover eventos e atualizar no backend
  const handleEventDrop = async (info) => {
    const updatedEvent = {
      due_date: info.event.start.toISOString(),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://beelife-private.onrender.com/api/tasks/${info.event.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEvents();
    } catch (error) {
      console.error("Erro ao mover evento:", error);
    }
  };

  return (
    <div className="calendar-container dark-theme" style={{ maxWidth: "90%", margin: "auto", padding: "20px" }}>
      <h2>📅 Minha Agenda</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale={ptBrLocale}
        events={events}
        selectable={true}
        editable={true}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
      />
    </div>
  );
};

export default GoogleCalendar;
