package vn.edu.hust.vrgamesapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.hust.vrgamesapp.constant.RoomStatus;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int capacity;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @ManyToMany(mappedBy = "rooms")
    private List<Game> games = new ArrayList<>();

    @OneToMany(mappedBy = "room", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = false)
    private List<Device> devices = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String imageUrl;
}