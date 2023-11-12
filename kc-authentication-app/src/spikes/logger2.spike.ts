import {createLogger, format, transports} from "winston";

// Configuración del logger
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()  // Utiliza el formato JSON para objetos
    ),
    transports: [
        new transports.Console()
    ]
});

// Ejemplo de cómo imprimir un objeto
let persona = {
    nombre: "Juan",
    edad: 25,
    ciudad: "Ejemploville"
};

logger.info("Información de la persona:", persona);