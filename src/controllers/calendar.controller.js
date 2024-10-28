import Event from '../schemas/eventModel.js';



// Obtener eventos
export const getEvents = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del evento desde los parámetros de la solicitud

    if (id) {
      // Si se proporciona un ID, buscar el evento por ese ID
      const event = await Event.findById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Evento no encontrado" });
      }

      return res.status(200).json(event); // Devolver solo el evento encontrado
    } else {
      // Si no se proporciona un ID, devolver todos los eventos
      const events = await Event.find();
      return res.status(200).json({ events }); // Enviar todos los eventos
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener eventos: " + error.message });
  }
};


// Crear evento
export const createEvent = async (req, res) => {
  const { title, start, end, allDay, userId } = req.body;

  // Validación básica de campos
  if (!title || !start || !end || !userId) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const newEvent = new Event({
    title,
    start,
    end,
    allDay: allDay ?? false, // Asignar `false` por defecto si no se proporciona
    userId,
  });

  try {
    const savedEvent = await newEvent.save();

    // Guardar información en las cookies (con seguridad mejorada)
    res.cookie('eventId', savedEvent._id, {
      maxAge: 900000, // 15 minutos
      httpOnly: false, // Solo accesible por el servidor
      // secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    });

    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al crear evento: " + error.message });
  }
};
// Obtener eventos por ID de usuario
export const getEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.query; // Usar userId del query params enviado desde el frontend

    if (!userId) {
      return res.status(400).json({ error: "No se proporcionó el ID del usuario" });
    }

    // Busca eventos que pertenezcan al usuario y llena los detalles del usuario
    const events = await Event.find({ userId }).populate('userId'); // Poblamos los campos 'name' y 'email' del usuario

    if (!events || events.length === 0) {
      return res.status(404).json({ error: "No se encontraron eventos para este usuario." });
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Actualizar evento
export const updateEvent = async (req, res) => {
  const { id } = req.params;

  // Verificar si el evento existe antes de actualizar
  const eventExists = await Event.findById(id);
  if (!eventExists) {
    return res.status(404).json({ message: "Evento no encontrado" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar evento: " + error.message });
  }
};

// Eliminar evento
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  // Verificar si el evento existe antes de eliminar
  const eventExists = await Event.findById(id);
  if (!eventExists) {
    return res.status(404).json({ message: "Evento no encontrado" });
  }

  try {
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar evento: " + error.message });
  }
};
