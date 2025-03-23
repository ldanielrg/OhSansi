Una vez clonado este proyecto coloca los siguientes comandos en la terminal:
    
BACKEND

    1. Copia y crea el archivo .env:
        cp .env.example .env

    2. Genera tu clave de aplicación única (App Key):
        php artisan key:generate

    3. En la carpeta backend:
        composer install

        Lo anterior instala todas las dependencias necesarias. Si se añadieron más, las descargará.

FRONTEND

    1. En la carpeta frontend:
        npm install

        Lo anterior instala todas las dependencias necesarias. Si se añadieron más, las descargará.
