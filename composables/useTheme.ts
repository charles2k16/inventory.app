// composable for theme management
export const useTheme = () => {
  const colorMode = useColorMode();

  const isDark = computed( {
    get () {
      return colorMode.value === 'dark';
    },
    set ( value: boolean ) {
      colorMode.preference = value ? 'dark' : 'light';
    },
  } );

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const setTheme = ( theme: 'dark' | 'light' | 'system' ) => {
    colorMode.preference = theme;
  };

  return {
    isDark,
    toggleTheme,
    setTheme,
    currentTheme: colorMode,
  };
};
