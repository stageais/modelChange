document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const modelId = params.get('id');

    if (!modelId) {
        window.location.href = 'index.html'; // Если ID не указан, возвращаемся на главную
        return;
    }

    const gallery = document.getElementById('masonry-gallery');
    const modelNameHeader = document.getElementById('model-name-header');
    const modelDescription = document.getElementById('model-description');
    const likeButton = document.getElementById('like-button');
    const likeCountSpan = document.getElementById('like-count');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const model = data.find(m => m.id === modelId);
            if (!model) {
                // Если модель не найдена
                modelNameHeader.textContent = "Модель не найдена";
                return;
            }

            // Заполняем информацию о модели
            modelNameHeader.textContent = model.name;
            document.title = model.name; // Меняем заголовок вкладки
            modelDescription.textContent = model.description;
            likeCountSpan.textContent = model.likes;
            
            // Отображаем все изображения
            model.images.forEach(imgSrc => {
                const item = document.createElement('div');
                item.className = 'masonry-item';
                
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Пример от ${model.name}`;
                img.loading = 'lazy'; // Ленивая загрузка картинок
                
                item.appendChild(img);
                gallery.appendChild(item);
            });
            
            // Логика лайков
            setupLikes(model.id, model.likes);
        });
});

function setupLikes(modelId, initialLikes) {
    const likeButton = document.getElementById('like-button');
    const likeCountSpan = document.getElementById('like-count');
    
    // Используем localStorage для хранения лайков на стороне пользователя
    let likedModels = JSON.parse(localStorage.getItem('likedModels')) || [];
    
    // Проверяем, лайкнул ли уже пользователь эту модель
    if (likedModels.includes(modelId)) {
        likeButton.classList.add('liked');
        likeButton.disabled = true; // Блокируем кнопку
    }
    
    likeButton.addEventListener('click', () => {
        if (!likeButton.classList.contains('liked')) {
            // Лайкаем
            likeButton.classList.add('liked');
            likeButton.disabled = true;
            
            // Обновляем счетчик на странице
            let currentLikes = parseInt(likeCountSpan.textContent);
            likeCountSpan.textContent = currentLikes + 1;
            
            // Сохраняем информацию, что пользователь лайкнул эту модель
            likedModels.push(modelId);
            localStorage.setItem('likedModels', JSON.stringify(likedModels));
            
            // Здесь в будущем можно будет отправить запрос на сервер для сохранения лайка
            console.log(`Лайк за модель ${modelId} засчитан! (локально)`);
        }
    });
}