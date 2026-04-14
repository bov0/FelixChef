export interface AppTexts {
  app: {
    name: string;
    recipes: string;
    adminPanel: string;
    login: string;
    logout: string;
  };
  header: {
    videosLabel: string;
    themeLight: string;
    themeDark: string;
  };
  layout: {
    homeTitle: string;
    homeSubtitle: string;
  };
  home: {
    filterTitle: string;
    clearFilters: string;
    selectIngredient: string;
    ingredientPlaceholder: string;
    sortLabel: string;
    sortMobileLabel: string;
    pageLabel: string;
    pageDivider: string;
    previous: string;
    next: string;
    noRecipesFound: string;
    sortOptions: { value: string; label: string }[];
  };
  recipeCard: {
    published: string;
    ingredients: string;
    moreDetails: string;
  };
  recipeDetail: {
    defaultTitle: string;
    subtitle: string;
    published: string;
    ingredientsSuffix: string;
    videoButton: string;
    backButton: string;
    ingredientsTitle: string;
    quantityDefault: string;
    notFound: string;
    backToRecipes: string;
  };
  auth: {
    pageTitle: string;
    pageSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitButton: string;
    backLink: string;
  };
  admin: {
    pageTitle: string;
    pageSubtitle: string;
    editorTab: string;
    recipesTab: string;
    ingredientsTab: string;
    createRecipe: string;
    editRecipe: string;
    cancelEdit: string;
    titleLabel: string;
    titlePlaceholder: string;
    youtubeLabel: string;
    youtubePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    youtubeInvalidWarning: string;
    ingredientsLabel: string;
    selectedLabel: string;
    addLabel: string;
    quantitiesLabel: string;
    quantityPlaceholder: string;
    removeButton: string;
    previewTitle: string;
    previewRecipePlaceholder: string;
    previewDescriptionPlaceholder: string;
    previewThumbnailEmpty: string;
    previewThumbnailWarning: string;
    manageRecipesTitle: string;
    reloadButton: string;
    newIngredientTitle: string;
    emojiLabel: string;
    emojiPlaceholder: string;
    nameLabel: string;
    ingredientNamePlaceholder: string;
    addIngredientButton: string;
    currentCatalogTitle: string;
    edit: string;
    delete: string;
    deleteIngredientButton: string;
    duplicateEmojiTitle: string;
    duplicateEmojiMessage: string;
    duplicateNameTitle: string;
    duplicateNameMessage: string;
    deleteIngredientTitle: string;
    deleteRecipeTitle: string;
    confirmContinue: string;
    confirmDelete: string;
  };
  messages: {
    fillRequiredFields: string;
    selectIngredientRequired: string;
    fillIngredientFields: string;
    recipeSaved: string;
    recipeUpdated: string;
    recipeDeleted: string;
    ingredientDeleted: string;
    ingredientCreated: string;
    deleteIngredientConfirmation: string;
    deleteRecipeConfirmation: string;
  };
  confirm: {
    cancel: string;
    confirm: string;
  };
}

export const TEXTS: AppTexts = {
  app: {
    name: '🧑🏽‍🍳FelixChef',
    recipes: 'Recetas',
    adminPanel: 'Panel',
    login: 'Login',
    logout: 'Salir'
  },
  header: {
    videosLabel: 'Recetas en video',
    themeLight: 'Modo claro',
    themeDark: 'Modo oscuro'
  },
  layout: {
    homeTitle: 'El Rincón de Félix',
    homeSubtitle:
      'Tras años trabajando en diferentes cocinas, Félix abre su recetario para compartir platos llenos de técnica, sabor y también opciones accesibles para disfrutar de la cocina en casa cada día.'
  },
  home: {
    filterTitle: 'Filtrar por ingrediente',
    clearFilters: 'Limpiar filtros',
    selectIngredient: 'Seleccionar ingrediente',
    ingredientPlaceholder: 'Elige un ingrediente...',
    sortLabel: 'Ordenar por',
    sortMobileLabel: 'Fecha desc',
    pageLabel: 'Página',
    pageDivider: 'de',
    previous: 'Anterior',
    next: 'Siguiente',
    noRecipesFound: 'No hay recetas que coincidan con ese ingrediente.',
    sortOptions: [
      { value: 'date-desc', label: 'Fecha descendente' },
      { value: 'date-asc', label: 'Fecha ascendente' },
      { value: 'title-asc', label: 'Titulo A-Z' },
      { value: 'title-desc', label: 'Titulo Z-A' }
    ]
  },
  recipeCard: {
    published: 'Publicado',
    ingredients: 'Ingredientes',
    moreDetails: 'Mas detalles'
  },
  recipeDetail: {
    defaultTitle: 'Detalle de receta',
    subtitle: 'Vista completa con ingredientes, cantidades y acceso directo al video.',
    published: 'Publicado',
    ingredientsSuffix: 'ingredientes',
    videoButton: 'Ver video',
    backButton: 'Volver',
    ingredientsTitle: 'Ingredientes',
    quantityDefault: 'Al gusto',
    notFound: 'No he encontrado esa receta.',
    backToRecipes: 'Volver a recetas'
  },
  auth: {
    pageTitle: 'Acceso para publicar',
    pageSubtitle:
      'Inicia sesión para acceder al panel de publicación y gestionar tus recetas.',
    emailLabel: 'Email',
    emailPlaceholder: 'tu-tio@felixchef.com',
    passwordLabel: 'Contrasena',
    passwordPlaceholder: '********',
    submitButton: 'Entrar al panel',
    backLink: 'Volver a las recetas'
  },
  admin: {
    pageTitle: 'Panel de publicacion',
    pageSubtitle: 'Aqui tu tio puede crear, editar y borrar recetas con un CRUD sencillo.',
    editorTab: 'Crear receta',
    recipesTab: 'Gestionar recetas',
    ingredientsTab: 'Gestionar ingredientes',
    createRecipe: 'Nueva receta',
    editRecipe: 'Editar receta',
    cancelEdit: 'Cancelar edicion',
    titleLabel: 'Titulo',
    titlePlaceholder: 'Croquetas caseras de jamon',
    youtubeLabel: 'URL de YouTube',
    youtubePlaceholder: 'https://www.youtube.com/watch?v=...',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Explica el paso a paso, trucos y tiempos.',
    youtubeInvalidWarning: 'La URL no parece un enlace valido de YouTube.',
    ingredientsLabel: 'Ingredientes',
    selectedLabel: 'Seleccionado',
    addLabel: 'Añadir',
    quantitiesLabel: 'Cantidades',
    quantityPlaceholder: 'Ej: 500 g, 2 unidades, al gusto',
    removeButton: 'Quitar',
    previewTitle: 'Vista previa',
    previewRecipePlaceholder: 'Tu proxima receta',
    previewDescriptionPlaceholder: 'La descripcion aparecera aqui segun vayas escribiendo.',
    previewThumbnailEmpty: 'La miniatura aparecera aqui en cuanto pegues el enlace del video.',
    previewThumbnailWarning: 'Introduce una URL valida de YouTube para ver la miniatura.',
    newIngredientTitle: 'Nuevo ingrediente',
    emojiLabel: 'Emoji',
    emojiPlaceholder: '🍗',
    nameLabel: 'Nombre',
    ingredientNamePlaceholder: 'Pollo',
    manageRecipesTitle: 'Gestionar recetas',
    reloadButton: 'Recargar',
    addIngredientButton: 'Añadir ingrediente',
    currentCatalogTitle: 'Catalogo actual',
    edit: 'Editar',
    delete: 'Eliminar',
    deleteIngredientButton: 'Eliminar',
    duplicateEmojiTitle: 'Ya existe un ingrediente con ese emoji',
    duplicateEmojiMessage:
      'Hemos encontrado ingredientes con el mismo emoji. Confirma si aun asi quieres añadir el nuevo.',
    duplicateNameTitle: 'Nombre parecido detectado',
    duplicateNameMessage:
      'Hemos encontrado ingredientes cuyo nombre contiene el texto del nuevo ingrediente, o al reves. Confirma si aun asi quieres añadirlo.',
    deleteIngredientTitle: 'Eliminar ingrediente',
    deleteRecipeTitle: 'Eliminar receta',
    confirmContinue: 'Continuar',
    confirmDelete: 'Eliminar'
  },
  messages: {
    fillRequiredFields:
      'Completa titulo, un video valido de YouTube y al menos un ingrediente.',
    selectIngredientRequired:
      'Debes seleccionar al menos un ingrediente antes de publicar.',
    fillIngredientFields: 'Completa emoji e ingrediente antes de añadirlo.',
    recipeSaved: 'Receta guardada correctamente.',
    recipeUpdated: 'Receta actualizada correctamente.',
    recipeDeleted: 'Receta eliminada correctamente.',
    ingredientDeleted: 'Ingrediente eliminado correctamente.',
    ingredientCreated: 'Ingrediente creado correctamente.',
    deleteIngredientConfirmation: 'Se eliminara del catalogo ',
    deleteRecipeConfirmation: 'Se eliminara la receta '
  },
  confirm: {
    cancel: 'Cancelar',
    confirm: 'Confirmar'
  }
};
