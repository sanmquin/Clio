import { Script } from '../types';

export const agricultureReading = {
  title: "Lectura: El Origen de la Agricultura y la Revolución Neolítica 🌾",
  content: `
# El Origen de la Agricultura y la Revolución Neolítica

Hace aproximadamente 10,000 a 12,000 años, la humanidad vivió una de las transformaciones más profundas de su historia: la **Revolución Neolítica**. Durante cientos de miles de años, los seres humanos fueron nómadas, viviendo en pequeños grupos que dependían de la caza, la pesca y la recolección de frutos silvestres.

## ¿Dónde y cómo comenzó?
La agricultura no surgió en un solo lugar, sino de forma independiente en distintas partes del planeta:
- **El Creciente Fértil (Medio Oriente):** Trigo, cebada, lentejas y domesticación de ovejas y cabras.
- **China (Valles del Río Amarillo y Yangtze):** Arroz y mijo.
- **Mesoamérica (México y Centroamérica):** Maíz, frijol, calabaza y chiles.
- **Los Andes (Sudamérica):** Papa (patata) y quinua.
- **Egipto y el Valle del Indo:** Cultivo intensivo impulsado por las crecidas de los ríos Nilo e Indo.

## Del Nomadismo al Sedentarismo
Al aprender a cultivar plantas y domesticar animales, los grupos humanos ya no necesitaban desplazarse constantemente en busca de alimento. Pudieron asentarse en un lugar fijo, dando origen a las **primeras aldeas y ciudades**.

## Impacto del Clima y la Domesticación
El fin de la última Era de Hielo trajo un clima más cálido y húmedo, facilitando el crecimiento de gramíneas silvestres. Los humanos comenzaron a seleccionar las semillas de las mejores plantas y los animales más dóciles (como perros, cabras, ovejas y vacas), alterando genéticamente las especies a lo largo de las generaciones.

## Ventajas y Nuevos Desafíos
- **Ventajas:** Excedente de alimentos, crecimiento demográfico, división del trabajo, desarrollo de tecnologías (cerámica, tejido, herramientas de piedra pulida).
- **Desafíos y Desventajas:** Dependencia del clima, enfermedades por hacinamiento y convivencia con animales, jerarquías sociales, propiedad privada y conflictos territoriales.
  `
};

export const agricultureScript: Script = {
  id: '0.Agriculture',
  title: 'Módulo 1: La Revolución Agrícola',
  description: 'Explora cómo el descubrimiento de la agricultura transformó a la humanidad de nómadas a sociedades sedentarias.',
  initialStepId: 'sound_check',
  lecture: agricultureReading,
  steps: [
    // Hardware onboarding steps
    {
      id: 'sound_check',
      prompt: 'Hola {userName}, soy Clio, tu tutora de Historia Universal. Antes de empezar, hagamos una prueba de sonido. Presiona el botón de reproducir para escuchar el audio de prueba.',
      requirement: 'Comprobar que el estudiante puede escuchar el sonido.',
      nextStepId: 'mic_check',
      type: 'sound-check',
    },
    {
      id: 'mic_check',
      prompt: '¡Excelente! Ahora probemos tu micrófono. Di unas palabras para verificar que puedo escucharte claramente.',
      requirement: 'Confirmar respuesta sonora y permiso de micrófono.',
      nextStepId: '[1] Origen',
      type: 'mic-check',
    },

    // 16 Questions based on content/0.Agriculture.md
    {
      id: '[1] Origen',
      prompt: '¡Bienvenido a nuestra lección sobre la Agricultura, {userName}! Para empezar: ¿Cómo crees que surgió la agricultura por primera vez en la historia?',
      requirement: 'El estudiante explica sus ideas sobre cómo los seres humanos descubrieron la agricultura.',
      nextStepId: '[2] Lugares',
      type: 'default',
    },
    {
      id: '[2] Lugares',
      prompt: 'Muy bien. ¿Por qué crees que la agricultura surgió casi al mismo tiempo en lugares tan distantes como China, India, Egipto, Medio Oriente y Mesoamérica?',
      requirement: 'El estudiante analiza los factores independientes o geográficos que llevaron al desarrollo agrícola global.',
      nextStepId: '[3] Nomadismo_Sedentarismo',
      type: 'default',
    },
    {
      id: '[3] Nomadismo_Sedentarismo',
      prompt: 'Interesante punto. ¿Por qué crees que las personas pasaron de la cacería y el nomadismo a la agricultura y el sedentarismo?',
      requirement: 'El estudiante menciona los motivos del cambio de estilo de vida nomadismo a sedentario.',
      nextStepId: '[4] Clima',
      type: 'default',
    },
    {
      id: '[4] Clima',
      prompt: 'Exacto. ¿Cómo pudo haber influido el clima y sus cambios en los inicios de la agricultura?',
      requirement: 'El estudiante reflexiona sobre el papel del clima (ej. fin de la Era de Hielo, lluvias) en el surgimiento de cultivos.',
      nextStepId: '[5] Evolucion_Cultivos',
      type: 'default',
    },
    {
      id: '[5] Evolucion_Cultivos',
      prompt: '¿Cómo crees que han cambiado el maíz, el trigo, los cereales y las legumbres desde la antigüedad hasta el día de hoy?',
      requirement: 'El estudiante describe la selección artificial y cambios en las plantas cultivadas.',
      nextStepId: '[6] Domesticacion_Animales',
      type: 'default',
    },
    {
      id: '[6] Domesticacion_Animales',
      prompt: 'Así es. Y respecto a la fauna: ¿Cómo cambiaron los animales silvestres cuando fueron domesticados por el ser humano?',
      requirement: 'El estudiante analiza los cambios físicos y de comportamiento en los animales domesticados.',
      nextStepId: '[7] Vida_Antes_Agr',
      type: 'default',
    },
    {
      id: '[7] Vida_Antes_Agr',
      prompt: 'Hagamos un viaje en el tiempo: ¿Cómo te imaginas que era la vida cotidiana de un ser humano antes de que existiera la agricultura?',
      requirement: 'El estudiante describe la vida nómada, la recolección y la caza.',
      nextStepId: '[8] Primer_Animal',
      type: 'default',
    },
    {
      id: '[8] Primer_Animal',
      prompt: '¿Cuál crees que fue el primer animal domesticado por los seres humanos? ¿Y por qué crees que fue ese?',
      requirement: 'El estudiante menciona al perro u otro animal y da razones prácticas o de compañía.',
      nextStepId: '[9] Inicios_Agr',
      type: 'default',
    },
    {
      id: '[9] Inicios_Agr',
      prompt: '¿Quiénes crees que fueron los primeros en observar y comenzar la siembra? ¿Cómo y por qué lo habrán hecho?',
      requirement: 'El estudiante teoriza sobre el rol de recolectores/mujeres y el método de observación de semillas.',
      nextStepId: '[10] Difusion',
      type: 'default',
    },
    {
      id: '[10] Difusion',
      prompt: '¿Cómo crees que se difundió la agricultura a través de las distintas regiones del mundo?',
      requirement: 'El estudiante aborda el intercambio, migraciones o descubrimientos independientes.',
      nextStepId: '[11] Ventajas_Desventajas',
      type: 'default',
    },
    {
      id: '[11] Ventajas_Desventajas',
      prompt: 'Toda gran revolución trae cambios positivos y desafíos. ¿Cuáles fueron las ventajas y desventajas de la agricultura?',
      requirement: 'El estudiante identifica ventajas (alimento constante, aldeas) y desventajas (trabajo duro, enfermedades, disputas).',
      nextStepId: '[12] Nuevas_Necesidades',
      type: 'default',
    },
    {
      id: '[12] Nuevas_Necesidades',
      prompt: 'Con el desarrollo de asentamientos agrícolas: ¿Qué nuevas necesidades e inventos surgieron a raíz de la agricultura?',
      requirement: 'El estudiante menciona herramientas, almacenamiento, cerámica, leyes o defensa.',
      nextStepId: '[13] Vida_Inicios',
      type: 'default',
    },
    {
      id: '[13] Vida_Inicios',
      prompt: '¿Cómo te imaginas que era la vida en una aldea durante los inicios de la agricultura?',
      requirement: 'El estudiante describe la convivencia en las primeras aldeas neolíticas.',
      nextStepId: '[14] Investigacion',
      type: 'default',
    },
    {
      id: '[14] Investigacion',
      prompt: 'Te invitamos a compartir algo curioso que hayas leído o investigado sobre los inicios de la agricultura. ¿Qué fue lo que más te llamó la atención?',
      requirement: 'El estudiante comparte un dato o aprendizaje personal sobre la agricultura antigua.',
      nextStepId: '[15] Importancia',
      type: 'default',
    },
    {
      id: '[15] Importancia',
      prompt: 'Ya casi terminamos, {userName}. ¿Por qué crees que es tan importante para nosotros hoy en día estudiar los orígenes de la agricultura?',
      requirement: 'El estudiante reflexiona sobre la importancia de comprender nuestras raíces e impacto histórico.',
      nextStepId: '[16] Civilizacion_Preferida',
      type: 'default',
    },
    {
      id: '[16] Civilizacion_Preferida',
      prompt: 'Para nuestra próxima lección: Entre China, India, Egipto y Medio Oriente, ¿cuál es la civilización antigua de la que más te gustaría aprender y por qué?',
      requirement: 'El estudiante elige una civilización y da razones para su interés.',
      nextStepId: null,
      type: 'default',
    },
  ],
};

export const hydrateText = (text: string, profile: { username?: string; [key: string]: any }): string => {
  let result = text;
  const userName = profile.username || 'estudiante';
  result = result.replace(/\{userName\}/g, userName);
  if (profile.domainAttributes) {
    Object.keys(profile.domainAttributes).forEach((key) => {
      const val = profile.domainAttributes?.[key] || '';
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
    });
  }
  return result;
};
