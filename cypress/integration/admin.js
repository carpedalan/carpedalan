import { API_PATH } from '../../shared/constants';

describe('Admin capabilities', () => {
  before(cy.loginAsAdmin);
  beforeEach(() => {
    cy.cleanDb();
  });

  // describe('Uploading Photos', () => {
  //   it('should be able to upload multiple files', function() {
  //     cy.goHome();
  //     cy.server();
  //     cy.get('[data-test="menu"]').click();
  //     cy.get('a')
  //       .contains('ADMIN')
  //       .click();

  //     cy.route('POST', `/${API_PATH}/posts`).as('posts');

  //     cy.fixture('kitty.jpg').then(fileContent1 => {
  //       cy.fixture('kitty2.jpg').then(fileContent2 => {
  //         cy.get('[data-test=multiUploader]').upload(
  //           [
  //             {
  //               fileContent: fileContent1,
  //               fileName: 'kitty.jpg',
  //             },
  //             {
  //               fileContent: fileContent2,
  //               fileName: 'kitty2.jpg',
  //             },
  //           ],
  //           { subjectType: 'input' },
  //         );
  //       });
  //     });
  //     cy.getTestId('handle').click();
  //     cy.get('[data-test=submitAll]').click({ force: true });
  //     cy.wait('@posts', { timeout: 20000 })
  //       .its('status')
  //       .should('be', 200);
  //     cy.wait('@posts', { timeout: 20000 })
  //       .its('status')
  //       .should('be', 200);
  //     cy.get('[data-test=menu]').click();
  //     cy.get('[href="/pending"]').click();
  //     cy.get('[data-test="original/kitty2.jpg"]').scrollIntoView();
  //     cy.get('[data-test="original/kitty.jpg"]').scrollIntoView();
  //     cy.task('removeUpload');
  //  });
  // });

  describe('Main Feed Inline Editing', () => {
    beforeEach(() => cy.visit('/'));
    it('can edit a post', () => {
      const description = 'descriptionz';
      cy.server();
      cy.route('PATCH', `${API_PATH}/posts/*`).as('patchPost');
      cy.scrollTo('top');
      cy.getTestId('editButton')
        .first()
        .click();
      cy.getTestId('descriptionField')
        .scrollIntoView()
        .clear()
        .type(description);
      cy.get('[data-test="tagsDropdown"]').click();
      cy.get('[data-test="maui2017"] > div').click({ force: true });
      cy.get('[type="submit"]').click();
      cy.wait('@patchPost').then(xhr => {
        cy.log(xhr);
        expect(xhr.request.body.description).to.equal(description);
        expect(xhr.status).to.equal(200);
      });
    });

    it('can set an item to pending', () => {
      cy.server();
      cy.route('PATCH', `${API_PATH}/posts/*`).as('patchPost');
      cy.getTestId('editButton')
        .first()
        .click();
      cy.getTestId('pending').click();

      cy.wait('@patchPost').then(xhr => {
        cy.log(xhr);
        expect(xhr.request.body.isPending).to.equal(true);
        expect(xhr.status).to.equal(200);
      });
    });
    it('can delete a post', () => {
      cy.server();
      cy.route('DELETE', `${API_PATH}/posts/*`).as('deletePost');
      cy.getTestId('editButton')
        .first()
        .click();
      cy.getTestId('delete').click();
      cy.getTestId('confirm').click();
      cy.wait('@deletePost').then(xhr => {
        cy.log(xhr);
        expect(xhr.status).to.equal(204);
      });
    });
  });

  describe('Bulk edits', () => {
    beforeEach(() => {
      cy.visit('/#grid');
    });
    it('should be able to bulk delete', () => {
      // Have to hard refresh because the db has been cleaned and need to have
      // correct ids for bulk operations (otherwise will be stale)

      cy.server();
      cy.route('DELETE', `${API_PATH}/posts/bulk`).as('bulkDelete');
      cy.get('picture')
        .first()
        .trigger('mousedown');
      cy.wait(1000);
      cy.get('picture')
        .first()
        .trigger('mouseup');
      cy.get('body')
        .type('{shift}', { release: false })
        .get('picture')
        .eq(4)
        .click();
      cy.getTestId('bulkDelete').click();
      cy.getTestId('confirm').click();
      cy.wait('@bulkDelete').then(xhr => {
        expect(xhr.request.body.ids.length).to.equal(5);
        expect(xhr.status).to.equal(204);
      });
    });

    it('should be able to bulk edit', () => {
      // Have to hard refresh because the db has been cleaned and need to have
      // correct ids for bulk operations (otherwise will be stale)
      cy.visit('/#grid');
      cy.server();
      cy.route('PATCH', `${API_PATH}/posts/bulk`).as('bulkPatch');
      cy.get('div.image')
        .first()
        .trigger('mousedown');
      cy.wait(1000);
      cy.get('div.image')
        .first()
        .trigger('mouseup');
      cy.get('body')
        .type('{shift}', { release: false })
        .get('div.image')
        .eq(4)
        .click();
      cy.getTestId('bulkEdit').click();
      const description = 'farts';
      cy.get('[data-test="description"]').type(description);
      cy.get('[data-test="tagsDropdown"]').click();
      cy.get('[data-test="kitty"] > div').click({ force: true });
      cy.getTestId('confirm').click();
      cy.wait('@bulkPatch').then(xhr => {
        expect(xhr.request.body.ids.length).to.equal(5);
        expect(xhr.request.body.description).to.equal(description);
        expect(xhr.request.body.tags.length).to.equal(1);
      });
    });
  });
});
