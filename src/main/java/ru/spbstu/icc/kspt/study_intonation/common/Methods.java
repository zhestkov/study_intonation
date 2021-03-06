package ru.spbstu.icc.kspt.study_intonation.common;

public final class Methods {
    /* Common methods */
    public static final String UPDATE = "/update";
    public static final String CREATE = "/create";
    public static final String DELETE = "/delete";
    public static final String SEARCH = "/search";
    public static final String ID_PATTERN = "/{id}";

    /*User methods*/
    public static final String USER_ID_PATTERN = "/{userId}";

    /*Mobile methods*/
    public static final String GET_AVAILABLE_COURSES = "/availableCourses";
    public static final String GET_ATTEMPTS = "/getUserAttempts";

    /*Courses methods*/
    public static final String AVAILABLE = "/available";

    /*Tasks methods*/
    public static final String UPLOAD_AUDIO = "/uploadAudio";
    public static final String DOWNLOAD_AUDIO = "/downloadAudio";
    public static final String UPLOAD_MARKUP = "/uploadMarkup";
}
