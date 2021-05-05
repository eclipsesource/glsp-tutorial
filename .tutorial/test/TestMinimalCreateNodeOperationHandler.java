/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
package org.eclipse.glsp.example.minimal.handler;
import java.util.Optional;

import org.eclipse.glsp.graph.GPoint;

import static org.easymock.EasyMock.expect;
import static org.easymock.EasyMock.replay;
import static org.easymock.EasyMock.verify;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.easymock.EasyMockExtension;
import org.easymock.Mock;
import org.easymock.TestSubject;
import org.easymock.MockType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(EasyMockExtension.class)
public class TestMinimalCreateNodeOperationHandler {

   @TestSubject
   MinimalCreateNodeOperationHandler nodeHandler = new MinimalCreateNodeOperationHandler();

   @Test
   public void testNodeSize() {
      Optional<GPoint> point = Optional.empty();

      assertEquals(nodeHandler.createNode(point, null).getSize().getHeight(), 20);
      assertEquals(nodeHandler.createNode(point, null).getSize().getWidth(), 20);
      
   }

}
