package main.java.ru.spbstu.telematics.simonenko.model.dto;

import javax.persistence.*;

@Entity
@Table(name = "T_FAMILY")
public class FamilyDTO {

	@Id
	@Column(name = "family_id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "description")
	private String description;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
