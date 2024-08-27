console.log('Woody Snippets Script Loaded');

// Crear un script externo dinámicamente
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
script.type = 'module';
script.onload = function () {
    // El script de Supabase se ha cargado, ahora podemos usarlo
    document.addEventListener('DOMContentLoaded', () => {
        // Personalizar el mensaje de validación del campo email
        const emailInput = document.getElementById('email');
        emailInput.oninvalid = function (event) {
            event.target.setCustomValidity("Por favor, ingresa un correo válido para poder continuar.");
        };

        emailInput.oninput = function (event) {
            event.target.setCustomValidity(""); // Restablece el mensaje de validación
        };


        import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
            .then(({
                createClient
            }) => {
                const supabase = createClient('https://ehtjagjztnbyxyjljvgv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodGphZ2p6dG5ieXh5amxqdmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ0NDAyNDMsImV4cCI6MjA0MDAxNjI0M30.rFbLoDuWmmUpcrbhoYB83J13SIeDp3UxmYDyCpFgcSI');


                document.getElementById('myForm').addEventListener('submit', async function (event) {
                    event.preventDefault();

                    const email = document.getElementById('email').value;
                    const fullName = document.getElementById('fullName').value;
                    const institution = document.getElementById('institution').value;

                    const {
                        data,
                        error
                    } = await supabase
                        .from('usuarios')
                        .insert([{
                            nombreCompleto: fullName,
                            email: email,
                            institucion: institution
                        }]);

                    if (error) {
                        alert('Error al insertar datos:');
                        console.error('Error al insertar datos:', error);
                    } else {
                        alert('Datos insertados');
                        // Aquí puedes agregar el código para descargar el PDF si lo deseas.
                        // Iniciar la descarga del PDF
                        const pdfUrl = 'https://www.oaxaca.gob.mx/medioambiente/wp-content/uploads/sites/59/2024/08/GACETA_NOVIEMBRE-16-30-IMPACTO-.pdf'; // Reemplaza esto con la URL real del PDF
                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = 'nombre_del_archivo.pdf'; // Cambia el nombre del archivo si es necesario
                        link.click();

                        // Limpiar el formulario
                        document.getElementById('myForm').reset();

                        // Cerrar el modal (asumiendo que estás usando Bootstrap para el modal)
                        const modalElement = document.getElementById('myModal');
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        modal.hide();
                    }
                });
            })
            .catch(err => {
                console.error('Error al cargar el módulo de Supabase:', err);
            });
    });
};
document.head.appendChild(script);