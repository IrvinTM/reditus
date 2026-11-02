package com.irvin.pos.dtos;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;

import com.irvin.pos.utils.CustomPage;

public class CustomPageDTO<T> {
    List<T> content = new ArrayList<>();

    CustomPage customPage;

    public CustomPageDTO(Page<T> page) {
        this.content = page.getContent();
        this.customPage = new CustomPage(page.getTotalElements(),
        page.getTotalPages(), page.getNumber(), page.getSize());
    }
    public CustomPageDTO(){
    }

    public void addContent(T contentItem){
	this.content.add(contentItem);
    }

    public List<T> getContent() {
	    return content;
    }
    public void setContent(List<T> content) {
	this.content = content;
    }
    public CustomPage getCustomPage() {
	return customPage;
    }
    public void setCustomPage(CustomPage customPage) {
	this.customPage = customPage;
    }
}
