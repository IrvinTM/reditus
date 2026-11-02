package com.irvin.pos.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.irvin.pos.utils.ApiError;

@ControllerAdvice
public class GlobalExceptionsHandler {

        // TODO check the path json response returned by req.getDescription

        @ExceptionHandler(PropertyAlreadyExistException.class)
        public ResponseEntity<ApiError> handlePropertyAlreadyExistEx(PropertyAlreadyExistException e, WebRequest req) {
                ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), e.getMessage(),
                                req.getDescription(false).replace("uri=", ""));
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(EntityNotFoundException.class)
        public ResponseEntity<ApiError> handleEntityNotFoundEx(EntityNotFoundException e, WebRequest req) {
                ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), e.getMessage(),
                                req.getDescription(false).replace("uri=", ""));
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler({ IllegalArgumentException.class, IllegalStateException.class })
        public ResponseEntity<ApiError> handleBusinessRulesExceptions(RuntimeException e, WebRequest req) {
                ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), e.getMessage(),
                                req.getDescription(false).replace("uri=", ""));
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
}
