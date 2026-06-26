/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Reactivo {
  id: string;
  titulo: string;
  instruccion: string;
  tipo: 'inputs-dobles' | 'glosario' | 'dialogo' | 'error-check' | 'textarea';
  config: {
    labelA?: string;
    labelB?: string;
    placeholderA?: string;
    placeholderB?: string;
    placeholder?: string;
    label1?: string;
    label2?: string;
    label3?: string;
    label4?: string;
    promptIA1?: string;
    promptIA2?: string;
    errorKeywords?: string[];
    errorMessage?: string;
    correctKeywords?: string[];
  };
}

export const reactivosPorSemana: Record<number, Reactivo[]> = {
  1: [
    {
      id: "s1_r1",
      titulo: "Sujeto Obligatorio - Ejercicio Práctico",
      instruccion: "En inglés, el pronombre 'It' o 'He/She' nunca debe omitirse. Traduce o reescribe la siguiente oración agregando el sujeto obligatorio: \"Es un lindo día hoy en Greenfield.\"",
      tipo: "error-check",
      config: {
        placeholder: "Escribe tu oración en inglés aquí...",
        correctKeywords: ["it", "is", "nice", "fine", "beautiful", "day"],
        errorKeywords: ["is nice day", "is beautiful day"],
        errorMessage: "🤖 Recuerda iniciar tu oración con el pronombre 'It' (It is a nice/beautiful day...). En inglés, el sujeto nunca se omite."
      }
    },
    {
      id: "s1_r2",
      titulo: "Formulario de Contacto del Alumno",
      instruccion: "Presenta tu información personal básica (nombre y edad) en inglés formal:",
      tipo: "inputs-dobles",
      config: {
        labelA: "Tu Nombre Completo (e.g., Robert Garza)",
        labelB: "Tu Edad (e.g., I am 20 years old)",
        placeholderA: "My name is...",
        placeholderB: "I am... years old"
      }
    },
    {
      id: "s1_r3",
      titulo: "Glosario de Saludos y Cortesía",
      instruccion: "Escribe 3 saludos formales diferentes en inglés (ej. Good morning, Hello, Good afternoon):",
      tipo: "glosario",
      config: {
        placeholder: "Escribe un saludo formal aquí..."
      }
    },
    {
      id: "s1_r4",
      titulo: "Simulación de Diálogo de Bienvenida",
      instruccion: "Completa el diálogo de primer contacto con tu tutor de Inteligencia Artificial:",
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: "02. Tutor IA:",
        label3: "03. Alumno:",
        label4: "04. Tutor IA:",
        promptIA1: "Nice to meet you! I am your institutional assistant. What is your nationality?",
        promptIA2: "Excellent! Welcome to our language immersion experience. I look forward to working with you."
      }
    },
    {
      id: "s1_r5",
      titulo: "Redacción: Mi Perfil Personal",
      instruccion: "Escribe un abstract corto sobre ti (mínimo 20 palabras) saludando al grupo e indicando tu nombre, edad e interés por aprender inglés:",
      tipo: "textarea",
      config: {
        placeholder: "Hello everyone, my name is..."
      }
    }
  ],
  2: [
    {
      id: "s2_r1",
      titulo: "Glosario del Aula de Clases",
      instruccion: "Identifica y agrega 3 palabras clave relacionadas con los objetos del salón de clases:",
      tipo: "glosario",
      config: {
        placeholder: "Escribe un objeto (pencil, book, whiteboard...)"
      }
    },
    {
      id: "s2_r2",
      titulo: "Demostrativos de Distancia",
      instruccion: "Completa el diálogo de objetos escolares usando 'This', 'That', 'These' o 'Those' según corresponda:",
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: "02. Tutor IA:",
        label3: "03. Alumno:",
        label4: "04. Tutor IA:",
        promptIA1: "Yes, that is correct! That book on the shelf is indeed mine. And what are these?",
        promptIA2: "Excellent identification! These notebooks are indeed yours. Keep practicing!"
      }
    },
    {
      id: "s2_r3",
      titulo: "Inventario: Inputs de Material",
      instruccion: "Indica qué objetos escolares tienes a la mano usando artículos definidos o indefinidos (a/an/the):",
      tipo: "inputs-dobles",
      config: {
        labelA: "Objeto Singular en tu escritorio",
        labelB: "Varios objetos escolares en tu mochila",
        placeholderA: "I have a pen",
        placeholderB: "I have some papers"
      }
    },
    {
      id: "s2_r4",
      titulo: "Concordancia de Demostrativos y Plurales",
      instruccion: "Corrige y reescribe la oración correspondiente: \"These book are very green and big on the table.\"",
      tipo: "error-check",
      config: {
        placeholder: "Reescribe la oración con la concordancia correcta...",
        correctKeywords: ["these", "books", "are"],
        errorKeywords: ["these book are"],
        errorMessage: "🤖 Recuerda que con 'These' o 'Those' el sustantivo debe ser plural (books, pens) y el verbo debe ser 'are'."
      }
    },
    {
      id: "s2_r5",
      titulo: "Reporte Escrito de Objetos Disponibles",
      instruccion: "Redacta un reporte descriptivo de cinco objetos que puedes identificar en tu salón o espacio de estudio actual utilizando demostrativos:",
      tipo: "textarea",
      config: {
        placeholder: "In my classroom, this whiteboard is clean. Those chairs are near the window..."
      }
    }
  ],
  3: [
    {
      id: "s3_r1",
      titulo: "Adjetivos Posesivos",
      instruccion: "Completa las oraciones sobre posesiones familiares. Usa 'His', 'Her', 'Their' o 'Its':",
      tipo: "inputs-dobles",
      config: {
        labelA: "Oración 1: Mary has a cat. (Su nombre es Luna)",
        labelB: "Oración 2: John has a car. (Su auto es azul)",
        placeholderA: "Her cat's name is Luna",
        placeholderB: "His car is blue"
      }
    },
    {
      id: "s3_r2",
      titulo: "Caso Genitivo ('s)",
      instruccion: "Reescribe la oración usando el genitivo sajón: \"The office of my father is local.\"",
      tipo: "error-check",
      config: {
        placeholder: "Escribe la oración con apóstrofe...",
        correctKeywords: ["father's", "office"],
        errorKeywords: ["office of my father"],
        errorMessage: "🤖 Recuerda usar el genitivo sajón: 'My father's office' en lugar de la traducción literal 'of the father'."
      }
    },
    {
      id: "s3_r3",
      titulo: "Vocabulario de Árbol Genealógico",
      instruccion: "Regresa y agrega 3 palabras correspondientes a miembros de la familia directa o indirecta:",
      tipo: "glosario",
      config: {
        placeholder: "Escribe parentescos (mother, uncle, cousin...)"
      }
    },
    {
      id: "s3_r4",
      titulo: "Diálogo: Presentando a la Familia",
      instruccion: "Completa la conversación inicial describiendo brevemente a tus familiares al Tutor IA:",
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: "02. Tutor IA:",
        label3: "03. Alumno:",
        label4: "04. Tutor IA:",
        promptIA1: "That is beautiful. What is your father's job? And how old is your sister?",
        promptIA2: "Wonderful! You have a lovely family. Let's practice possessive pronouns next."
      }
    },
    {
      id: "s3_r5",
      titulo: "Mi Árbol Familiar Redactado",
      instruccion: "Redacta un texto corto en inglés de 30 palabras describiendo tu árbol genealógico inmediato usando adjetivos posesivos:",
      tipo: "textarea",
      config: {
        placeholder: "In my family, my father's name is Robert. My mother has two dogs..."
      }
    }
  ],
  4: [
    {
      id: "s4_r1",
      titulo: "Reglas de Mayúsculas (Capitalization)",
      instruccion: "Corrige y reescribe la oración con las mayúsculas correctas para nacionalidades e idiomas: \"she speaks spanish and english in mexico.\"",
      tipo: "error-check",
      config: {
        placeholder: "Escribe la oración corregida...",
        correctKeywords: ["She", "Spanish", "English", "Mexico"],
        errorKeywords: ["spanish", "english", "mexico"],
        errorMessage: "🤖 ¡Atención a las mayúsculas en los idiomas (Spanish, English) y países (Mexico)!"
      }
    },
    {
      id: "s4_r2",
      titulo: "Glosario de Países y Gentilicios",
      instruccion: "Escribe 3 gentilicios o nacionalidades en inglés con mayúscula inicial:",
      tipo: "glosario",
      config: {
        placeholder: "Mexican, French, Japanese..."
      }
    },
    {
      id: "s4_r3",
      titulo: "Preposiciones de Lugar: From / In",
      instruccion: "Completa con 'from' o 'in' de acuerdo con las procedencias geográficas:",
      tipo: "inputs-dobles",
      config: {
        labelA: "Procedencia nacional (ej. I am... Mexico)",
        labelB: "Ubicación urbana (ej. I live... Monterrey)",
        placeholderA: "I am from Mexico",
        placeholderB: "I live in Monterrey"
      }
    },
    {
      id: "s4_r4",
      titulo: "Diálogo: Control de Pasaportes",
      instruccion: "Completa la simulación de entrevista migratoria respondiendo al oficial de aduana virtual:",
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: "02. Tutor IA:",
        label3: "03. Alumno:",
        label4: "04. Tutor IA:",
        promptIA1: "Passport please. Where are you from today and what languages do you speak?",
        promptIA2: "Perfect. Have a great stay here! Enjoy your travel experiences."
      }
    },
    {
      id: "s4_r5",
      titulo: "Redacción de Formulario de Aduana",
      instruccion: "Escribe una declaración formal de propósitos de viaje indicando de dónde vienes, qué idioma dominas y cuánto tiempo te quedarás en la ciudad:",
      tipo: "textarea",
      config: {
        placeholder: "I am traveling from Mexico. I speak Spanish and English. I am visiting for research..."
      }
    }
  ],
  5: [
    {
      id: "s5_r1",
      titulo: "Artículos Definidos e Indefinidos",
      instruccion: "Completa usando 'a', 'an' o 'the' según corresponda: \"I have ___ apple and ___ orange on ___ desk.\"",
      tipo: "inputs-dobles",
      config: {
        labelA: "Espacio 1 y 2 (Frutas)",
        labelB: "Espacio 3 (Mobiliario)",
        placeholderA: "an apple and an orange",
        placeholderB: "on the desk"
      }
    },
    {
      id: "s5_r2",
      titulo: "Glosario de Deportes y Hobbys",
      instruccion: "Registra tres deportes o actividades de ocio populares en inglés:",
      tipo: "glosario",
      config: {
        placeholder: "Escribe deportes (soccer, swimming, gaming...)"
      }
    },
    {
      id: "s5_r3",
      titulo: "Gramática: Artículos y Aficiones",
      instruccion: "Identifica y corrige el error común relacionado al uso de artículos: \"I like a playing the soccer.\"",
      tipo: "error-check",
      config: {
        placeholder: "Escribe la oración corregida sin artículos redundantes...",
        correctKeywords: ["i", "like", "playing", "soccer"],
        errorKeywords: ["the soccer", "a playing"],
        errorMessage: "🤖 Por regla general, no se utiliza 'the' ni 'a' antes del nombre de los deportes (I like playing soccer)."
      }
    },
    {
      id: "s5_r4",
      titulo: "Diálogo: Mi Fin de Semana Libre",
      instruccion: "Simula coordinar planes deportivos y de esparcimiento saludable con tu tutor IA:",
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: "02. Tutor IA:",
        label3: "03. Alumno:",
        label4: "04. Tutor IA:",
        promptIA1: "I love outdoor sports. Do you play any sports or have an active weekend hobby?",
        promptIA2: "Awesome! We should organize a friendly match or a project group workout soon."
      }
    },
    {
      id: "s5_r5",
      titulo: "Ensayo Pequeño: Mi Pasatiempo Favorito",
      instruccion: "Escribe un breve ensayo de 40 palabras justificando por qué tu pasatiempo favorito impacta de forma positiva tu vida diaria:",
      tipo: "textarea",
      config: {
        placeholder: "My favorite hobby is reading. It allows me to learn new words and relax after a busy day..."
      }
    }
  ]
};

// Generar de forma sofisticada juegos de 5 ejercicios excelentes para las semanas 6 a 18
const temasSemana: Record<number, { tema: string; keywordA: string; keywordB: string }> = {
  6: { tema: "Descripción Física de Personas y Adjetivos de Aspecto", keywordA: "he is tall and thin", keywordB: "she has friendly brown eyes" },
  7: { tema: "Actividades de la Rutina Diaria (Por la Mañana)", keywordA: "I wake up at seven", keywordB: "I eat breakfast with coffee" },
  8: { tema: "Rutina de Trabajo y Actividades por la Tarde", keywordA: "he works in the office", keywordB: "we usually have lunch together" },
  9: { tema: "Hábitos Nocturnos, Descanso y Fin de la Jornada", keywordA: "I read a book before bed", keywordB: "it helps me sleep better" },
  10: { tema: "Ubicación Espacial, Habitaciones y Muebles de Casa", keywordA: "there is a table in the room", keywordB: "there are chairs next to it" },
  11: { tema: "Medios de Transporte y Traslados en la Ciudad", keywordA: "I take the subway to go", keywordB: "we drive through the streets" },
  12: { tema: "El Tiempo de Ocio y Frecuencia de Actividades", keywordA: "I practice twice a week", keywordB: "she seldom plays video games" },
  13: { tema: "Alimentos, Nutrición Básica y Menú de Casa", keywordA: "there is some milk in the fridge", keywordB: "we do not have any apples left" },
  14: { tema: "Habilidades Cotidianas, Talentos y Capacidades", keywordA: "I can speak English well", keywordB: "he cannot run very quickly" },
  15: { tema: "Estaciones del Año, Ropa y Clima Diario", keywordA: "it is raining outside", keywordB: "I need to wear a heavy coat" },
  16: { tema: "Compras en Tiendas, Precios y Regateo Básico", keywordA: "how much is this jacket", keywordB: "how many apples do you want" },
  17: { tema: "Fórmulas de Cortesía, Permisos y Pedir Favor", keywordA: "could you help me please", keywordB: "may I borrow your dictionary" },
  18: { tema: "Planificación Vacacional y Deseos para el Verano", keywordA: "I want to visit London next", keywordB: "we are planning a summer trip" }
};

for (let i = 6; i <= 18; i++) {
  const info = temasSemana[i];
  reactivosPorSemana[i] = [
    {
      id: `s${i}_r1`,
      titulo: `Gramática y Estructura - Ejercicio 1 (Semana ${i})`,
      instruccion: `Corrige la concordancia o redacción de este enunciado vinculado a: ${info.tema}`,
      tipo: "error-check",
      config: {
        placeholder: "Escribe la corrección oficial aquí...",
        correctKeywords: info.keywordA.split(" "),
        errorKeywords: ["no subject", "bad conjugation"],
        errorMessage: `🤖 Recuerda repasar las reglas de construcción aprendidas para ${info.tema}.`
      }
    },
    {
      id: `s${i}_r2`,
      titulo: `Vocabulario Aplicado - Ejercicio 2 (Semana ${i})`,
      instruccion: `Completa los dos campos utilizando expresiones clave del tema semanal:`,
      tipo: "inputs-dobles",
      config: {
        labelA: "Estructura Base / Práctica A",
        labelB: "Estructura Secundaria / Práctica B",
        placeholderA: info.keywordA,
        placeholderB: info.keywordB
      }
    },
    {
      id: `s${i}_r3`,
      titulo: `Glosario de Sesión síncrona - Ejercicio 3 (Semana ${i})`,
      instruccion: `Escribe 3 palabras clave en inglés relacionadas al tema: ${info.tema}:`,
      tipo: "glosario",
      config: {
        placeholder: "Término 1, Término 2, Término 3..."
      }
    },
    {
      id: `s${i}_r4`,
      titulo: `Chat Práctico Conversacional - Ejercicio 4 (Semana ${i})`,
      instruccion: `Completa la conversación interactiva con tu tutor de Inteligencia Artificial para comprobar asimilación de contenidos:`,
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: `02. Tutor IA (Semana ${i}):`,
        label3: "03. Alumno:",
        label4: `04. Tutor IA (Semana ${i}):`,
        promptIA1: `Interesting comment! How do you apply this in¹ your personal routine?`,
        promptIA2: `I completely agree. That represents excellent comprehension of this week's content. Let's keep exploring.`
      }
    },
    {
      id: `s${i}_r5`,
      titulo: `Ensayo de Nivelación - Ejercicio 5 (Semana ${i})`,
      instruccion: `Escribe una disertación práctica corta (mínimo 30 palabras) fundamentando tus ejemplos prácticos del tema: ${info.tema}`,
      tipo: "textarea",
      config: {
        placeholder: `Write your text about ${info.tema} here...`
      }
    }
  ];
}
