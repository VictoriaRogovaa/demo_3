document.addEventListener('DOMContentLoaded', function() {
  // Элементы
  const mainScreen = document.getElementById('mainScreen');
  const startBtn = document.getElementById('startBtn');
  const registrationForm = document.getElementById('registrationForm');
  
  // Данные пользователя
  const userData = {
    name: '',
    age: '',
    city: '',
    interests: [],
    moodColor: '#6C5CE7',
    avatar: null
  };
  
  let currentStep = 1;
  const totalSteps = 6;
  
  // Инициализация
  startBtn.addEventListener('click', startRegistration);
  
  function startRegistration() {
    mainScreen.classList.add('hidden');
    registrationForm.classList.remove('hidden');
    loadRegistrationForm();
  }
  
  function loadRegistrationForm() {
    registrationForm.innerHTML = `
      <div class="form-step active" data-step="1">
        <h2>Как вас зовут?</h2>
        <input type="text" class="input-field" id="userName" placeholder="Ваше имя" required>
        <button class="btn next-step">Далее</button>
      </div>
      
      <div class="form-step" data-step="2">
        <h2>Сколько вам лет?</h2>
        <input type="number" class="input-field" id="userAge" min="18" max="100" placeholder="Ваш возраст" required>
        <div class="navigation">
          <button class="btn prev-step">Назад</button>
          <button class="btn next-step">Далее</button>
        </div>
      </div>
      
      <div class="form-step" data-step="3">
        <h2>Ваш город</h2>
        <input type="text" class="input-field" id="userCity" placeholder="Где вы живете?" required>
        <div class="navigation">
          <button class="btn prev-step">Назад</button>
          <button class="btn next-step">Далее</button>
        </div>
      </div>
      
      <div class="form-step" data-step="4">
        <h2>Что вам нравится? (выберите 1-3)</h2>
        <div class="tags-container">
          <div class="tag" data-interest="music">🎵 Музыка</div>
          <div class="tag" data-interest="sports">⚽ Спорт</div>
          <div class="tag" data-interest="books">📚 Книги</div>
          <div class="tag" data-interest="travel">✈️ Путешествия</div>
          <div class="tag" data-interest="art">🎨 Искусство</div>
          <div class="tag" data-interest="games">🎮 Игры</div>
        </div>
        <div class="navigation">
          <button class="btn prev-step">Назад</button>
          <button class="btn next-step">Далее</button>
        </div>
      </div>
      
      <div class="form-step" data-step="5">
        <h2>Ваш любимый цвет</h2>
        <div class="colors-container">
          <div class="color-option" style="background: #6C5CE7;" data-color="#6C5CE7"></div>
          <div class="color-option" style="background: #00B894;" data-color="#00B894"></div>
          <div class="color-option" style="background: #FD79A8;" data-color="#FD79A8"></div>
          <div class="color-option" style="background: #FDCB6E;" data-color="#FDCB6E"></div>
        </div>
        <div class="navigation">
          <button class="btn prev-step">Назад</button>
          <button class="btn next-step">Далее</button>
        </div>
      </div>
      
      <div class="form-step" data-step="6">
        <h2>Ваше фото профиля</h2>
        <div class="avatar-upload">
          <label class="btn">
            📸 Выбрать фото
            <input type="file" id="avatarUpload" accept="image/*" style="display: none;">
          </label>
          <div class="avatar-preview hidden" id="avatarPreview"></div>
        </div>
        <div class="navigation">
          <button class="btn prev-step">Назад</button>
          <button class="btn" id="completeBtn">Завершить</button>
        </div>
      </div>
    `;
    
    initFormHandlers();
  }
  
  function initFormHandlers() {
    // Навигация
    document.querySelectorAll('.next-step').forEach(btn => {
      btn.addEventListener('click', goToNextStep);
    });
    
    document.querySelectorAll('.prev-step').forEach(btn => {
      btn.addEventListener('click', goToPrevStep);
    });
    
    // Интересы
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', function() {
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          userData.interests = userData.interests.filter(i => i !== this.dataset.interest);
        } else {
          if (userData.interests.length < 3) {
            this.classList.add('selected');
            userData.interests.push(this.dataset.interest);
          } else {
            alert('Можно выбрать не более 3 интересов');
          }
        }
      });
    });
    
    // Цвета
    document.querySelectorAll('.color-option').forEach(color => {
      color.addEventListener('click', function() {
        document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        userData.moodColor = this.dataset.color;
        document.documentElement.style.setProperty('--primary', this.dataset.color);
      });
    });
    
    // Аватар
    document.getElementById('avatarUpload')?.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          userData.avatar = event.target.result;
          const preview = document.getElementById('avatarPreview');
          preview.style.backgroundImage = `url(${event.target.result})`;
          preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Завершение
    document.getElementById('completeBtn')?.addEventListener('click', showProfile);
  }
  
  function goToNextStep() {
    if (!validateStep(currentStep)) return;
    saveStepData(currentStep);
    
    document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
    currentStep++;
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
  }
  
  function goToPrevStep() {
    document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
    currentStep--;
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
  }
  
  function validateStep(step) {
    switch(step) {
      case 1:
        if (!document.getElementById('userName').value.trim()) {
          alert('Пожалуйста, введите ваше имя');
          return false;
        }
        return true;
      case 2:
        const age = parseInt(document.getElementById('userAge').value);
        if (isNaN(age) || age < 18 || age > 100) {
          alert('Пожалуйста, введите корректный возраст (18-100)');
          return false;
        }
        return true;
      case 3:
        if (!document.getElementById('userCity').value.trim()) {
          alert('Пожалуйста, укажите ваш город');
          return false;
        }
        return true;
      case 4:
        if (userData.interests.length === 0) {
          alert('Пожалуйста, выберите хотя бы один интерес');
          return false;
        }
        return true;
      case 5:
        if (!userData.moodColor) {
          alert('Пожалуйста, выберите цвет');
          return false;
        }
        return true;
      default:
        return true;
    }
  }
  
  function saveStepData(step) {
    switch(step) {
      case 1:
        userData.name = document.getElementById('userName').value.trim();
        break;
      case 2:
        userData.age = document.getElementById('userAge').value;
        break;
      case 3:
        userData.city = document.getElementById('userCity').value.trim();
        break;
    }
  }
  
  function showProfile() {
    if (!validateStep(currentStep)) return;
    saveStepData(currentStep);
    
    registrationForm.innerHTML = `
      <div class="profile-card">
        <div class="avatar-preview" style="background-image: url(${userData.avatar || 'https://i.imgur.com/JiZw5QK.png'});"></div>
        <h2 class="profile-name">${userData.name}</h2>
        <p class="profile-age">${userData.age} лет</p>
        <div class="profile-city">${userData.city}</div>
        
        <div class="profile-interests">
          ${userData.interests.map(interest => 
            `<div class="interest-tag">${getInterestEmoji(interest)} ${getInterestName(interest)}</div>`
          ).join('')}
        </div>
        
        <div class="profile-footer">
          Готово к знакомствам!
        </div>
      </div>
      
      <button class="btn" id="restartBtn">Создать новый профиль</button>
    `;
    
    document.getElementById('restartBtn').addEventListener('click', () => {
      location.reload();
    });
  }
  
  function getInterestEmoji(interest) {
    const emojis = {
      music: '🎵',
      sports: '⚽',
      books: '📚',
      travel: '✈️',
      art: '🎨',
      games: '🎮'
    };
    return emojis[interest] || '❤️';
  }
  
  function getInterestName(interest) {
    const names = {
      music: 'Музыка',
      sports: 'Спорт',
      books: 'Книги',
      travel: 'Путешествия',
      art: 'Искусство',
      games: 'Игры'
    };
    return names[interest] || interest;
  }
});