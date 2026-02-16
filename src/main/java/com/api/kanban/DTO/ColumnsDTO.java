package com.api.kanban.DTO;

import lombok.Data;

@Data
public class ColumnsDTO {
    private String statusTitle;
    
    public ColumnsDTO(){}

    public ColumnsDTO(String statusTitle) {this.statusTitle = statusTitle;}
}
