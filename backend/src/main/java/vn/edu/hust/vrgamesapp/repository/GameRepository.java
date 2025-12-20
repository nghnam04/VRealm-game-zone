package vn.edu.hust.vrgamesapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.edu.hust.vrgamesapp.constant.GameGenre;
import vn.edu.hust.vrgamesapp.entity.Game;

import java.util.Collection;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long>, JpaSpecificationExecutor<Game> {
}
