package com.exadel.etoolbox.query.core.services;

import org.apache.sling.api.resource.Resource;

import java.io.OutputStream;
import java.util.List;

public interface PdfExporterService {
    void export(OutputStream out, List<Resource> resources);
}
