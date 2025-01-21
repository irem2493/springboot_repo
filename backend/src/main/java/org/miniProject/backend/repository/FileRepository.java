package org.miniProject.backend.repository;

import org.miniProject.backend.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Integer> {
    public File findFileByFileRefIdAndFileGubnCode(String fileRefId, String fileGubnCode);
}
