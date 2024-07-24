class Alumno {
    constructor(nombre, apellidos, edad, sexo) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.sexo = sexo;
        this.materiasInscritas = [];
        this.calificaciones = {};
    }

    inscribirMateria(materia) {
        if (!this.materiasInscritas.includes(materia)) {
            this.materiasInscritas.push(materia);
        }
    }

    asignarCalificacion(materia, calificacion) {
        if (this.materiasInscritas.includes(materia)) {
            this.calificaciones[materia] = calificacion;
        } else {
            console.log(`El alumno no está inscrito en la materia ${materia}`);
        }
    }

    obtenerPromedio() {
        const calificaciones = Object.values(this.calificaciones);
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        return calificaciones.length ? (suma / calificaciones.length) : 0;
    }
}

const alumnos = [];
const grupos = {};

// Función para abrir modales
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.style.display = 'block';
}

// Función para cerrar modales
function cerrarModal(modal) {
    modal.style.display = 'none';
}

document.querySelectorAll('.cerrar').forEach(btn => {
    btn.onclick = function() {
        const modal = this.parentElement.parentElement;
        cerrarModal(modal);
    }
});

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        cerrarModal(event.target);
    }
};

document.getElementById('abrir-modal-alta').onclick = function() {
    abrirModal('modal-alta');
};
document.getElementById('abrir-modal-inscribir').onclick = function() {
    abrirModal('modal-inscribir');
};
document.getElementById('abrir-modal-calificacion').onclick = function() {
    abrirModal('modal-calificacion');
};
document.getElementById('abrir-modal-grupo').onclick = function() {
    abrirModal('modal-grupo');
};
document.getElementById('abrir-modal-asignar-grupo').onclick = function() {
    abrirModal('modal-asignar-grupo');
};

// Función para actualizar la tabla de alumnos
function actualizarTablaAlumnos(listaAlumnos = alumnos) {
    const tabla = document.getElementById('tabla-alumnos').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';  // Limpiar la tabla

    listaAlumnos.forEach(alumno => {
        const nuevaFila = tabla.insertRow();

        const celdaNombre = nuevaFila.insertCell(0);
        const celdaApellidos = nuevaFila.insertCell(1);
        const celdaEdad = nuevaFila.insertCell(2);
        const celdaSexo = nuevaFila.insertCell(3);
        const celdaMaterias = nuevaFila.insertCell(4);
        const celdaCalificaciones = nuevaFila.insertCell(5);

        celdaNombre.textContent = alumno.nombre;
        celdaApellidos.textContent = alumno.apellidos;
        celdaEdad.textContent = alumno.edad;
        celdaSexo.textContent = alumno.sexo;
        celdaMaterias.textContent = alumno.materiasInscritas.join(', ');
        celdaCalificaciones.textContent = JSON.stringify(alumno.calificaciones);
    });
}

// Función para actualizar la tabla de grupos
function actualizarTablaGrupos() {
    const tabla = document.getElementById('tabla-grupos').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';  // Limpiar la tabla

    for (const [nombreGrupo, integrantes] of Object.entries(grupos)) {
        const nuevaFila = tabla.insertRow();

        const celdaNombreGrupo = nuevaFila.insertCell(0);
        const celdaIntegrantes = nuevaFila.insertCell(1);

        celdaNombreGrupo.textContent = nombreGrupo;
        celdaIntegrantes.textContent = integrantes.map(alumno => alumno.nombre).join(', ');
    }
}

// Manejar el envío del formulario de alta de alumno
document.getElementById('form-alta-alumno').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const edad = document.getElementById('edad').value;
    const sexo = document.getElementById('sexo').value;

    const nuevoAlumno = new Alumno(nombre, apellidos, edad, sexo);
    alumnos.push(nuevoAlumno);

    actualizarTablaAlumnos();

    document.getElementById('form-alta-alumno').reset();
    cerrarModal(document.getElementById('modal-alta'));
});

// Manejar el envío del formulario de inscripción a una clase
document.getElementById('form-inscribir-clase').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreAlumno = document.getElementById('nombre-alumno').value;
    const materia = document.getElementById('materia').value;

    const alumno = alumnos.find(al => al.nombre === nombreAlumno);
    if (alumno) {
        alumno.inscribirMateria(materia);
        alert(`Alumno inscrito en la materia ${materia}`);
    } else {
        alert(`Alumno ${nombreAlumno} no encontrado.`);
    }

    actualizarTablaAlumnos();
    document.getElementById('form-inscribir-clase').reset();
    cerrarModal(document.getElementById('modal-inscribir'));
});

// Manejar el botón de cargar materias inscritas
document.getElementById('cargar-materias').addEventListener('click', function() {
    const nombreAlumno = document.getElementById('nombre-alumno-calificacion').value;
    const materiaSelect = document.getElementById('materia-calificacion');

    // Buscar el alumno por nombre
    const alumno = alumnos.find(al => al.nombre === nombreAlumno);
    if (alumno) {
        // Limpiar el menú desplegable de materias
        materiaSelect.innerHTML = '';

        // Añadir las materias inscritas del alumno al menú desplegable
        alumno.materiasInscritas.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia;
            option.textContent = materia;
            materiaSelect.appendChild(option);
        });
    } else {
        alert(`Alumno ${nombreAlumno} no encontrado.`);
    }
});

// Manejar el envío del formulario de asignación de calificación
document.getElementById('form-asignar-calificacion').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreAlumno = document.getElementById('nombre-alumno-calificacion').value;
    const materia = document.getElementById('materia-calificacion').value;
    const calificacion = parseFloat(document.getElementById('calificacion').value);

    const alumno = alumnos.find(al => al.nombre === nombreAlumno);
    if (alumno) {
        alumno.asignarCalificacion(materia, calificacion);
        alert(`Calificación asignada en la materia ${materia}`);
    } else {
        alert(`Alumno ${nombreAlumno} no encontrado.`);
    }

    actualizarTablaAlumnos();
    document.getElementById('form-asignar-calificacion').reset();
    cerrarModal(document.getElementById('modal-calificacion'));
});

// Manejar el envío del formulario de creación de grupo
document.getElementById('form-crear-grupo').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreGrupo = document.getElementById('nombre-grupo').value;

    if (!grupos[nombreGrupo]) {
        grupos[nombreGrupo] = [];
        alert(`Grupo ${nombreGrupo} creado.`);
    } else {
        alert(`El grupo ${nombreGrupo} ya existe.`);
    }

    actualizarTablaGrupos();
    document.getElementById('form-crear-grupo').reset();
    cerrarModal(document.getElementById('modal-grupo'));
});

// Manejar el botón de cargar grupos
document.getElementById('cargar-grupos').addEventListener('click', function() {
    const grupoSelect = document.getElementById('nombre-grupo-asignar');
    grupoSelect.innerHTML = '';

    for (const nombreGrupo in grupos) {
        const option = document.createElement('option');
        option.value = nombreGrupo;
        option.textContent = nombreGrupo;
        grupoSelect.appendChild(option);
    }
});

// Manejar el envío del formulario de asignación de grupo
document.getElementById('form-asignar-grupo').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreAlumno = document.getElementById('nombre-alumno-grupo').value;
    const nombreGrupo = document.getElementById('nombre-grupo-asignar').value;

    const alumno = alumnos.find(al => al.nombre === nombreAlumno);
    if (alumno) {
        if (grupos[nombreGrupo]) {
            if (!grupos[nombreGrupo].includes(alumno)) {
                grupos[nombreGrupo].push(alumno);
                alert(`Alumno ${nombreAlumno} asignado al grupo ${nombreGrupo}`);
            } else {
                alert(`El alumno ${nombreAlumno} ya está en el grupo ${nombreGrupo}`);
            }
        } else {
            alert(`El grupo ${nombreGrupo} no existe.`);
        }
    } else {
        alert(`Alumno ${nombreAlumno} no encontrado.`);
    }

    actualizarTablaGrupos();
    document.getElementById('form-asignar-grupo').reset();
    cerrarModal(document.getElementById('modal-asignar-grupo'));
});

// Función para buscar alumnos por nombre
document.getElementById('boton-buscar-nombre').addEventListener('click', function() {
    const nombreBuscar = document.getElementById('buscar-nombre').value.toLowerCase();
    const alumnosFiltrados = alumnos.filter(alumno => alumno.nombre.toLowerCase().includes(nombreBuscar));
    actualizarTablaAlumnos(alumnosFiltrados);
});

// Función para buscar alumnos por apellido
document.getElementById('boton-buscar-apellido').addEventListener('click', function() {
    const apellidoBuscar = document.getElementById('buscar-apellido').value.toLowerCase();
    const alumnosFiltrados = alumnos.filter(alumno => alumno.apellidos.toLowerCase().includes(apellidoBuscar));
    actualizarTablaAlumnos(alumnosFiltrados);
});

// Función para buscar alumnos por sexo
document.getElementById('boton-buscar-sexo').addEventListener('click', function() {
    const sexoBuscar = document.getElementById('buscar-sexo').value;
    const alumnosFiltrados = alumnos.filter(alumno => alumno.sexo === sexoBuscar);
    actualizarTablaAlumnos(alumnosFiltrados);
});

// Función para obtener el promedio de un alumno
document.getElementById('boton-obtener-promedio').addEventListener('click', function() {
    const nombreBuscar = document.getElementById('nombre-promedio').value;
    const alumno = alumnos.find(al => al.nombre === nombreBuscar);
    if (alumno) {
        const promedio = alumno.obtenerPromedio();
        document.getElementById('promedio-alumno').textContent = promedio.toFixed(2);
    } else {
        document.getElementById('promedio-alumno').textContent = 'Alumno no encontrado';
    }
});

// Función para obtener el promedio de un grupo
document.getElementById('boton-obtener-promedio-grupo').addEventListener('click', function() {
    const nombreGrupoBuscar = document.getElementById('nombre-grupo-promedio').value;
    const grupo = grupos[nombreGrupoBuscar];
    if (grupo && grupo.length > 0) {
        const promedios = grupo.map(alumno => alumno.obtenerPromedio());
        const promedioGrupo = promedios.reduce((a, b) => a + b, 0) / promedios.length;
        document.getElementById('promedio-grupo').textContent = promedioGrupo.toFixed(2);
    } else {
        document.getElementById('promedio-grupo').textContent = 'Grupo no encontrado o sin alumnos';
    }
});

// Función para ordenar alumnos por promedio
function ordenarAlumnos(orden) {
    const alumnosOrdenados = [...alumnos].sort((a, b) => {
        const promedioA = a.obtenerPromedio();
        const promedioB = b.obtenerPromedio();
        return orden === 'ascendente' ? promedioA - promedioB : promedioB - promedioA;
    });
    actualizarTablaAlumnos(alumnosOrdenados);
}

// Manejar los botones de ordenación
document.getElementById('ordenar-ascendente').addEventListener('click', function() {
    ordenarAlumnos('ascendente');
});

document.getElementById('ordenar-descendente').addEventListener('click', function() {
    ordenarAlumnos('descendente');
});
