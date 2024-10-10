if (isLoading) {
    // Отображаем заставку, пока приложение загружается
    return (
      <div className="loading-screen">
        <img src={loadingGif} alt="Loading..." />
      </div>
    );
  }