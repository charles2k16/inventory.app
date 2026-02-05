export default defineNuxtPlugin( () => {
  // Ensure the color-mode module is properly initialized
  // The module will automatically handle dark class application to html element

  if ( process.client ) {
    // Auto-detect system preference on first load
    const colorMode = useColorMode();

    // Watch for color mode changes and apply them
    watch( () => colorMode.preference, ( newValue ) => {
      if ( newValue === 'dark' ) {
        document.documentElement.classList.add( 'dark' );
      } else {
        document.documentElement.classList.remove( 'dark' );
      }
    } );
  }
} );
