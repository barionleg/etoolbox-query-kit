/*
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.exadel.etoolbox.querykit.core.models.query;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.query.QueryResult;
import javax.jcr.query.RowIterator;

/**
 * Implements {@link QueryResult} to provide the result bundled with the total number of entries
 */
@RequiredArgsConstructor
public class MeasuredQueryResult implements QueryResult {

    private final QueryResult original;

    /**
     * Retrieves the total number of entries for the current query
     */
    @Getter
    private final long total;

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] getColumnNames() throws RepositoryException {
        return original.getColumnNames();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public RowIterator getRows() throws RepositoryException {
        return original.getRows();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public NodeIterator getNodes() throws RepositoryException {
        return original.getNodes();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] getSelectorNames() throws RepositoryException {
        return original.getSelectorNames();
    }
}
