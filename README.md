# MoodList

Aplicación web que utiliza la API de Spotify para recomendar canciones al usuario, basadas en sus gustos musicales y también en varios parámetros ajustables por el usuario, como la positividad de la canción, nivel de energía, bailabilidad, etc.

## Parámetros
Esta es la lista de los parámetros disponibles para elegir actualmente.

**Bailabilidad**: Determina que tan bailable es la canción, en base a su estabilidad rítmica y otros factores.

**Positividad**: Los valores bajos de positividad están relacionados a canciones que muestran más emociones negativas como ira, tristeza, depresión, etc., mientras que los valores altos están asociados a emociones positivas como alegría, euforia y calma.

**Popularidad**: Las canciones con niveles altos de popularidad tienen muchas reproducciones en Spotify, y las que tienen muchas reproducciones en un tiempo reciente incluso tienen niveles más altos.

**Energía**: Las canciones con niveles de energía alto son percibidas como intensas y activas, y estas presentan un sonido rápido y fuerte. En lo contrario, las canciones con un nivel de energía bajo son más lentas y suenan más despacio.

## Uso

Actualmente no es posible utilizar la aplicación debido a que aún no ha sido aprobada para uso público por Spotify, aunque si es posible instalarla localmente.

## Instalación

Para ejecutar la aplicación localmente, clona el repositorio y ejecuta el comando 
```bash
npm run dev -- --open
```
Luego, dirígete al archivo **src/stores.js** y edita la variable **appUrl** por la URL que tengas en tu entorno de desarrollo o de producción. 
También edita el archivo **src/Components/Login.svelte**, cambiando **clientId** por tu client URL de Spotify, obtenible en https://developer.spotify.com/.

Para preparar la aplicación para producción, ejecuta el comando
```bash
npm run build
```