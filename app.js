// app.js para Amigo secreto, ver. input con enter y botón Mostrar/Ocultar por participante
(() => {


  const input = document.getElementById('amigo');
  const listaEl = document.getElementById('listaAmigos');
  const resultadoEl = document.getElementById('resultado');

  
  let nextId = 1; 
  const participantes = []; 
  
 
  window.agregarAmigo = function agregarAmigo() {
    const nombre = input.value.trim();
    if (!nombre) {
      alert('Escribe un nombre antes de añadir.');
      input.focus();
      return;
    }

    participantes.push({ id: nextId++, name: nombre });
    input.value = '';
    input.focus();
    renderListaParticipantes();
        resultadoEl.innerHTML = '';
  };

  function renderListaParticipantes() {
    listaEl.innerHTML = '';

    if (participantes.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No hay amigos añadidos aún.';
      listaEl.appendChild(li);
      return;
    }

    participantes.forEach((p, index) => {
      const li = document.createElement('li');
      li.className = 'name-item';

      const span = document.createElement('span');
      span.textContent = p.name;
      span.className = 'name-text';

      const eliminarBtn = document.createElement('button');
      eliminarBtn.textContent = 'Eliminar';
      eliminarBtn.className = 'btn-eliminar';
      eliminarBtn.setAttribute('aria-label', `Eliminar ${p.name}`);

      eliminarBtn.addEventListener('click', () => {
        if (confirm(`¿Eliminar a ${p.name}?`)) {
          participantes.splice(index, 1);
          renderListaParticipantes();
          resultadoEl.innerHTML = ''; 
        }
      });

      li.appendChild(span);
      li.appendChild(eliminarBtn);
      listaEl.appendChild(li);
    });
  }

  function sattoloShuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      // elegir j en [0, i-1]
      const j = Math.floor(Math.random() * i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function crearAsignacion() {
    const n = participantes.length;
    if (n <= 1) return null;

    const indices = participantes.map((_, i) => i);
    const perm = sattoloShuffle(indices);
    const mapa = new Map();
    for (let i = 0; i < n; i++) {
      const giverId = participantes[i].id;
      const receiverName = participantes[perm[i]].name;
      mapa.set(giverId, receiverName);
    }
    return mapa;
  }

  window.sortearAmigo = function sortearAmigo() {
    resultadoEl.innerHTML = '';

    if (participantes.length < 2) {
      alert('Necesitas al menos 2 personas para sortear.');
      return;
    }

    const asignacion = crearAsignacion();
    if (!asignacion) {
      alert('No se pudo generar la asignación. Intenta de nuevo.');
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'result-list-inner';

    participantes.forEach(p => {
      const li = document.createElement('li');
      li.className = 'result-item';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = p.name;
      nameSpan.className = 'giver-name';

      const spacer = document.createElement('span');
      spacer.textContent = ' ';

      const revealBtn = document.createElement('button');
      revealBtn.textContent = 'Ver mi amigo';
      revealBtn.className = 'reveal-btn';
      revealBtn.setAttribute('aria-expanded', 'false');

      const receiverSpan = document.createElement('span');
      receiverSpan.textContent = asignacion.get(p.id);
      receiverSpan.className = 'receiver-name';
      receiverSpan.style.display = 'none'; 

      revealBtn.addEventListener('click', () => {
        const visible = receiverSpan.style.display !== 'none';
        receiverSpan.style.display = visible ? 'none' : '';
        revealBtn.textContent = visible ? 'Ver mi amigo' : 'Ocultar';
        revealBtn.setAttribute('aria-expanded', visible ? 'false' : 'true');
      });

      li.appendChild(nameSpan);
      li.appendChild(spacer);
      li.appendChild(revealBtn);
      li.appendChild(spacer.cloneNode(true));
      li.appendChild(receiverSpan);
      ul.appendChild(li);
    });

    resultadoEl.appendChild(ul);
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      window.agregarAmigo();
    }
  });

 
  renderListaParticipantes();
})();


