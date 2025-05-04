Una vez clonado este proyecto coloca los siguientes comandos en la terminal:
    
BACKEND

    1. En la carpeta backend:
        composer install

        Lo anterior instala todas las dependencias necesarias. Si se añadieron más, las descargará.

    2. Create en la carpeta "backend" un archivo llamado '.env'
    3. Copia y pega el contenido de '.env.example' a ese nuevo archivo.
    4. Modifica los campos para la Base de Datos
        DB_CONNECTION=pgsql
        DB_HOST=aws-0-sa-east-1.pooler.supabase.com
        DB_PORT=5432
        DB_DATABASE=postgres
        DB_USERNAME=postgres.tktztrgmnxnwplszmhww
        DB_PASSWORD=tis2140

FRONTEND

    1. En la carpeta frontend:
        npm install

        Lo anterior instala todas las dependencias necesarias. Si se añadieron más, las descargará.
