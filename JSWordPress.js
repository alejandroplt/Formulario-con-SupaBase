// Crear un script externo dinámicamente
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
script.type = 'module';
script.onload = function () {
    // El script de Supabase se ha cargado, ahora podemos usarlo
    document.addEventListener('DOMContentLoaded', () => {
        // Personalizar el mensaje de validación del campo email
        const emailInput = document.getElementById('email');
        emailInput.oninvalid = function(event) {
            event.target.setCustomValidity("Por favor, ingresa un correo válido para poder continuar.");
        };

        emailInput.oninput = function(event) {
            event.target.setCustomValidity(""); // Restablece el mensaje de validación
        };

        // Asignar el fileId al campo oculto cuando se hace clic en un botón
        document.querySelectorAll('[data-bs-target="#myModal"]').forEach(button => {
            button.addEventListener('click', function () {
                const fileId = this.getAttribute('data-file-id');
                document.getElementById('fileId').value = fileId;
                
                // Si el formulario ya fue enviado, deshabilitar los inputs
                if (formSubmitted) {
                    document.getElementById('email').disabled = true;
                    document.getElementById('fullName').disabled = true;
                    document.getElementById('institution').disabled = true;
                } else {
                    document.getElementById('email').disabled = false;
                    document.getElementById('fullName').disabled = false;
                    document.getElementById('institution').disabled = false;
                }
            });
        });

        import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
            .then(({ createClient }) => {
                const supabase = createClient('https://ehtjagjztnbyxyjljvgv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodGphZ2p6dG5ieXh5amxqdmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ0NDAyNDMsImV4cCI6MjA0MDAxNjI0M30.rFbLoDuWmmUpcrbhoYB83J13SIeDp3UxmYDyCpFgcSI');

                document.getElementById('myForm').addEventListener('submit', async function (event) {
                    event.preventDefault();

                    // Deshabilitar temporalmente el botón de envío para evitar múltiples envíos
                    const submitButton = document.getElementById('submit');
                    submitButton.disabled = true;

                    try {
                        const email = document.getElementById('email').value;
                        const fullName = document.getElementById('fullName').value;
                        const institution = document.getElementById('institution').value;
                        const fileId = document.getElementById('fileId').value;

                        // Verificar si el correo ya existe en la base de datos
                        const { data: existingUser, error: fetchError } = await supabase
                            .from('usuarios')
                            .select('email')
                            .eq('email', email)
                            .maybeSingle(); // Cambiamos single() a maybeSingle() para manejar mejor los resultados nulos

                        if (fetchError) {
                            console.error('Error al verificar el correo:', fetchError);
                            alert('Hubo un problema al verificar el correo. Intenta nuevamente.');
                        } else if (existingUser) {
                            console.log('El correo ya existe:', existingUser.email);
                            // El correo ya existe, por lo tanto, solo se descarga el archivo

                            const link = document.createElement('a');
                            link.href = `http://festivaldelasavesoaxaca.local/wp-content/uploads/2024/08/${fileId}.pdf`; // Ajusta esta ruta según la ubicación real de tus archivos PDF
                            link.download = `${fileId}.pdf`;
                            document.body.appendChild(link); // Agrega el enlace al body para asegurar que se pueda hacer clic
                            link.click();
                            document.body.removeChild(link); // Elimina el enlace del body después de la descarga

                        } else {
                            // El correo no existe, se inserta el nuevo registro
                            const { data, error } = await supabase
                                .from('usuarios')
                                .insert([
                                    { nombreCompleto: fullName, email: email, institucion: institution }
                                ]);

                            if (error) {
                                alert('Error al insertar datos:');
                                console.error('Error al insertar datos:', error);
                            } else {
                                alert('Datos insertados correctamente.');
                                console.log('Datos insertados correctamente:', data);

                                // Descargar archivo PDF según el ID del botón
                                const link = document.createElement('a');
                                link.href = `http://festivaldelasavesoaxaca.local/wp-content/uploads/2024/08/${fileId}.pdf`; // Ajusta esta ruta según la ubicación real de tus archivos PDF
                                link.download = `${fileId}.pdf`;
                                document.body.appendChild(link); // Agrega el enlace al body para asegurar que se pueda hacer clic
                                link.click();
                                document.body.removeChild(link); // Elimina el enlace del body después de la descarga
                            }
                        }

                        // Cambiar el estado para que los campos se deshabiliten en el futuro
                        formSubmitted = true;
                        // Cerrar el modal
                        const modalElement = document.getElementById('myModal');
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        modal.hide();

                    } catch (err) {
                        console.error('Error en el formulario:', err);
                    } finally {
                        // Habilitar el botón de envío nuevamente
                        submitButton.disabled = false;
                    }
                });
            });
    });
};
document.head.appendChild(script);