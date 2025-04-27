// Función para manejar el sonido de notificación y mensajes alternativos
function initWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsapp-popup');
    const whatsappWrapper = document.querySelector('.whatsapp-wrapper');
    const closeButton = document.querySelector('.close_whatsapp');
    const messageContainer = document.querySelector('.whatsapp-message-wrapper .whatsapp-chat-message');
    const notificationSound = document.getElementById('notification-sound');
    const loadingAnimation = document.querySelector('.loading-animation');
    const chatMessageWrapper = document.querySelector('.whatsapp-message-wrapper');
    let userInteracted = false;
    let clickCount = 0;
    let scrollDetected = false;
    let loadingTimeout = null; // NUEVO: para controlar el "setTimeout" y cancelarlo
  
    const messages = [
      { text: ["¡Hola! 👋", "¿Te ayudamos a encontrar tu propiedad ideal?"] },
      { text: ["¡Bienvenido! 🏡", "Consulta sin compromiso, estamos para ayudarte."] },
      { text: ["¿Tienes dudas? 📩", "Escríbenos, te orientamos enseguida."] },
      { text: ["¡Estamos en línea! 💬", "Conversemos sobre tu próxima inversión."] },
      { text: ["Hola 👋", "¿Buscas información de algún predio? Pregúntanos."] },
      { text: ["¿Necesitas asesoría? 🏢", "Estamos disponibles para ayudarte."] },
      { text: ["¡No dudes en escribirnos! ✨", "Respondemos todas tus consultas."] },
      { text: ["Asesoría personalizada 📍", "Cuéntanos qué predio te interesa."] },
      { text: ["¡Queremos ayudarte! 🛤️", "Escríbenos para más información."] },
      { text: ["¿Te interesa algún predio? �️", "Estamos listos para asistirte."] },
      { text: ["Información rápida 📑", "Escríbenos tus dudas aquí."] },
      { text: ["¡Hola! 🙌", "Consulta gratis y sin compromiso."] }
    ];
  
    notificationSound.volume = 0.3;
  
    const handleUserInteraction = () => {
      if (!userInteracted) {
        userInteracted = true;
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        
        // Mostrar la burbuja cuando el usuario interactúa por primera vez (click/touch)
        whatsappButton.style.opacity = '1';
        whatsappButton.style.transform = 'translateY(0)';
        setTimeout(() => {
          const notification = document.querySelector('.bubble-notification');
          if (notification) {
            notification.style.animation = 'delayedShow 0.5s forwards, pulse 2s infinite 0.5s, bounce 1.5s infinite';
            playNotificationSound();
          }
        }, 0);
      }
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
  
    const playNotificationSound = () => {
      try {
        notificationSound.currentTime = 0;
        const playPromise = notificationSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Si no hay interacción, intentamos forzar mute y reproducir
            notificationSound.muted = true;
            notificationSound.play().then(() => {
              notificationSound.muted = false;
            });
          });
        }
      } catch (e) {
        // Silencio
      }
    };
  
    const updateMessage = () => {
      const messageIndex = clickCount % messages.length;
      const currentMessage = messages[messageIndex];
      
      messageContainer.innerHTML = '';
      
      currentMessage.text.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        messageContainer.appendChild(p);
      });
      
      const timeElement = document.querySelector('.whatsapp-chat-time');
      if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
    };
  
    const handleScroll = () => {
      if (!scrollDetected) {
        scrollDetected = true;
        setTimeout(() => {
          whatsappButton.style.opacity = '1';
          whatsappButton.style.transform = 'translateY(0)';
          setTimeout(() => {
            const notification = document.querySelector('.bubble-notification');
            if (notification) {
              notification.style.animation = 'delayedShow 0.5s forwards, pulse 2s infinite 0.5s, bounce 1.5s infinite';
              playNotificationSound();
            }
          }, 0);
        }, 3000);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
  
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
    whatsappButton.addEventListener('click', () => {
      if (whatsappWrapper.classList.contains('hide-whatsapp')) {
        clickCount++;
        updateMessage();
  
        whatsappWrapper.classList.remove('hide-whatsapp');
        whatsappWrapper.classList.add('show-whatsapp');
        document.querySelector('.bubble-notification').style.display = 'none';
  
        // Reset de estados:
        clearTimeout(loadingTimeout);
        chatMessageWrapper.classList.remove('show');
        loadingAnimation.style.display = 'flex';
  
        loadingTimeout = setTimeout(() => {
          loadingAnimation.style.display = 'none';
          chatMessageWrapper.classList.add('show');
        }, 3000);
      } else {
        closeChat();
      }
    });
  
    const closeChat = () => {
      whatsappWrapper.classList.remove('show-whatsapp');
      whatsappWrapper.classList.add('hide-whatsapp');
  
      clearTimeout(loadingTimeout); // Importante: cancela si estaba esperando
      loadingAnimation.style.display = 'flex';
      chatMessageWrapper.classList.remove('show');
    };
  
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeChat();
    });
  
    document.addEventListener('click', (e) => {
      if (!whatsappWrapper.contains(e.target) && 
          !whatsappButton.contains(e.target) && 
          whatsappWrapper.classList.contains('show-whatsapp')) {
        closeChat();
      }
    });
  
    document.querySelector('.whatsapp-btn')?.addEventListener('click', (e) => {
      if (isMobile) {
        e.preventDefault();
        window.location.href = e.target.closest('a').href;
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsAppButton);
  } else {
    initWhatsAppButton();
  }